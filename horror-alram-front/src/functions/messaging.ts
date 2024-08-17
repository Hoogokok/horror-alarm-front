import { FIREBASE_CONFIG } from "../config.js";
import { initializeApp as fcm } from "firebase/app";
import {
  getMessaging, getToken, deleteToken,
} from "firebase/messaging";
import axios from "axios";

const app = fcm(FIREBASE_CONFIG);
const messaging = getMessaging(app);

interface AlarmStatus {
  permission: string;
  subscribe: Array<boolean>;
  error: any;
}

interface SubscriptionResponse {
  status: string;
  error: any;
}

interface TokenTime {
  newToken: string;
  newTime: string;
}

interface TopicContents {
  topicContents: Array<string>;
}


async function handleInitialSubscription(): Promise<AlarmStatus> {
  console.log("초기화 작업 시작")
  const permission = checkPermission();
  if (permission === 'granted') {
    try {
      const token = await getToken(messaging);
      const result = await checkTokenTimeStamps(token);
      const topicContents: string[] = (await getCheckedTopicsSubscribed(result.newToken)).topicContents;
      if (!topicContents) {
        return { permission, subscribe: [false, false], error: null };
      }
      return { permission, subscribe: [topicContents.includes('upcoming_movie'), topicContents.includes('netflix_expiring')], error: null };
    } catch (error) {
      console.error("초기 구독 확인 실패", error);
      return { permission, subscribe: [false, false], error };
    }
  }
  return { permission, subscribe: [false, false], error: null };
}

async function getCheckedTopicsSubscribed(token: string): Promise<TopicContents> {
  const response = await axios.get(`${process.env.REACT_APP_ALARM_API_URL}/api/subscriptions?token=${token}`)
    .then(r => r.data)
    .catch((error) => {
      console.error("토픽 확인 실패", error);
      return { topicContents: [] };
    });
  return { topicContents: response.value.data };
}

async function handleAlarmPermission(): Promise<boolean> {
  const permission = checkPermission();
  if (permission === 'granted') {
    alert('알람을 해제하려면 브라우저 설정에서 알람 권한을 해제해주세요.');
    return true;
  }
  if (permission === 'denied') {
    await requestPermission().then(() => {
      const permission = checkPermission();
      return permission === 'granted';
    });
  }
  if (permission === 'default') {
    await requestPermission().then(() => {
      const permission = checkPermission();
      return permission === 'granted';
    });
  }
  return false;
}

function checkPermission(): string {
  try {
    const permission = Notification.permission;
    console.log('Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('An error occurred while checking permission. ', error);
    return 'default';
  }
}

async function handleUpcomingMovieSubscribe(checkedPermission: boolean,
  checkedSubscribe: boolean): Promise<SubscriptionResponse> {
  if (checkedPermission) {
    const token = await getToken(messaging);
    if (!checkedSubscribe) {
      return await subscribed(token, 'upcoming_movie');

    } else {
      return await unsubscribed(token, 'upcoming_movie');
    }
  } else {
    return { status: "error", error: "알람 권한을 허용해주세요." };
  }
}

async function handleNetflixSubscribe(checkedPermission: boolean, checkNetflix: boolean): Promise<SubscriptionResponse> {
  if (checkedPermission) {
    const token = await getToken(messaging);
    if (!checkNetflix) {
      return await subscribed(token, 'netflix_expiring');

    } else {
      return await unsubscribed(token, 'netflix_expiring');
    }
  } else {
    return { status: "error", error: "알람 권한을 허용해주세요." };
  }
}

async function subscribed(token: string, topic: string): Promise<SubscriptionResponse> {
  /*
   1. 토큰이 존재하는 지 찾는다
   2. 토큰이 존재하면 해당 토큰을 사용하여 토픽을 구독한다
   */
  const url = `${process.env.REACT_APP_ALARM_API_URL}/api/subscribe`;
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify({ token: token, topic: topic })
  }).then(r => {
    return { status: "subscribe", error: null };
  }).catch((error) => {
    console.error("구독 실패", error);
    return { status: "error", error: error };
  });
}

async function unsubscribed(token: string, topic: string): Promise<SubscriptionResponse> {
  const url = `${process.env.REACT_APP_ALARM_API_URL}/api/unsubscribe`;
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify({ token: token, topic: topic })
  }).then(r => {
    return { status: "unsubscribe", error: null };
  }
  ).catch((error) => {
    console.error("구독 해제 실패", error);
    return { status: "error", error: error };
  });
}

async function checkTokenTimeStamps(token: string): Promise<TokenTime> {
  /*
  1. 토큰의 시간이 한 달이 지났는지 확인한다.
  2. 한 달이 지났으면 새로운 토큰을 생성하고 시간을 업데이트한다.
  3. 한 달이 지나지 않았으면 토큰을 그대로 사용한다.
   */
  interface TokenStampResponse {
    kind: string;
    value?: { data: boolean };
    error?: any;
  }
  const response: TokenStampResponse = await axios.get(`${process.env.REACT_APP_ALARM_API_URL}/api/timestamp?token=${token}`)
    .then(r => r.data)
    .catch((error) => {
      console.error("토큰 시간 확인 실패", error);
      return { newToken: token, newTime: "" };
    });
  console.log(response);
  if (response.value?.data) {
    return await updateTokenAndTime(token);
  }
  return { newToken: token, newTime: "" };
}

async function updateTokenAndTime(token: string): Promise<TokenTime> {
  const date = new Date();
  const newTime = date.toISOString().split('T')[0];
  await deleteToken(messaging);
  const newToken = await getToken(messaging);
  await fetch(`${process.env.REACT_APP_ALARM_API_URL}/api/timestamp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify({ oldToken: token, newToken, newTime })
  });
  return { newToken, newTime };
}

async function createTokenAndTime(): Promise<TokenTime> {
  try {
    const newToken = await getToken(messaging);
    const date = new Date(); // 현재 날짜 및 시간
    const newTime = date.toISOString().split('T')[0]; // "2023-04-22"
    return { newToken, newTime };
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
    return { newToken: "", newTime: "" }
  }
}

async function requestPermission(): Promise<void> {
  try {
    await Notification.requestPermission();
    const { newToken, newTime } = await createTokenAndTime();
    console.log("Permission granted");
    await axios.post(`${process.env.REACT_APP_ALARM_API_URL}/api/permission`, { token: newToken, time: newTime })
      .then(r => r.data)
      .catch((error) => {
        console.error("알람 권한 요청 실패", error);
      });
  } catch (error) {
    alert('알람 권한을 허용해주세요.');
  }
}

export {
  requestPermission,
  checkPermission,
  handleAlarmPermission,
  handleUpcomingMovieSubscribe,
  handleNetflixSubscribe,
  handleInitialSubscription
};
