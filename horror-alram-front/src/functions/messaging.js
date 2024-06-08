import { FIREBASE_CONFIG, SUPABASE_CONFIG } from "../config.js";
import { initializeApp as fcm } from "firebase/app";
import {
  getMessaging, getToken, deleteToken,
} from "firebase/messaging";

const app = fcm(FIREBASE_CONFIG);
const messaging = getMessaging(app);

class AlarmStatus {
  permission = "default" || "granted" || "denied";
  subscribe = [false, false];
  error = null;

  constructor(permission, subscribe) {
    this.permission = permission;
    this.subscribe = subscribe;
  }
}

class SubscriptionResponse {
  status = "success" || "error";
  error = null;

  constructor(data) {
    this.data = data;
  }
}


async function handleInitialSubscription() {
  console.log("초기화 작업 시작")
  const permission = checkPermission();
  if (permission === 'granted') {
    try {
      const token = await getToken(messaging);
      const result = await checkTokenTimeStamps(token);
      const topicContents = await getCheckedTopicsSubscribed(result.newToken);
      return new AlarmStatus(permission, [topicContents.includes('upcoming_movie'), topicContents.includes('netflix_expiring')]);
    } catch (error) {
      console.error("초기 구독 확인 실패", error);
      return new AlarmStatus(permission, [false, false], error);
    }
  }
  return new AlarmStatus(false, [false, false]);
}

async function getCheckedTopicsSubscribed(token) {
  const url = `${process.env.REACT_APP_ALARM_API_URL}/api/subscriptions?token=${token}`;
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
    },
    mode: 'cors'
    ,
  }).then(r => r.json())
    .then((data) => {
      const { value } = data;
      return value.data;
    })
    .catch((error) => {
      console.error("토픽 확인 실패", error);
      return [];
    });
}

async function handleAlarmPermission() {
  const permission = checkPermission();
  if (permission === 'granted') {
    alert('알람을 해제하려면 브라우저 설정에서 알람 권한을 해제해주세요.');
    return true;
  }
  if (permission === 'denied') {
    await requestPermission().then(() => {
      checkPermission().then(result => {
        return result === 'granted';
      });
    });
  }
  if (permission === 'default') {
    await requestPermission().then(() => {
      checkPermission().then(result => {
        return result === 'granted';
      });
    });
  }
}

function checkPermission() {
  try {
    const permission = Notification.permission;
    console.log('Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('An error occurred while checking permission. ', error);
    return false;
  }
}

async function handleUpcomingMovieSubscribe(checkedPermission,
  checkedSubscribe) {
  if (checkedPermission) {
    const token = await getToken(messaging);
    if (!checkedSubscribe) {
      await subscribed(token, 'upcoming_movie');
      return true;
    } else {
      await unsubscribed(token, 'upcoming_movie');
      return false;
    }
  } else {
    alert('알람 권한을 허용해주세요.');
    return checkedPermission;
  }
}

async function handleNetflixSubscribe(checkedPermission, checkNetflix) {
  if (checkedPermission) {
    const token = await getToken(messaging);
    if (!checkNetflix) {
      await subscribed(token, 'netflix_expiring');
      return true
    } else {
      await unsubscribed(token, 'netflix_expiring');
      return false;
    }
  } else {
    alert('알람 권한을 허용해주세요.');
  }
}

async function subscribed(token, topic) {
  /*
   1. 토큰이 존재하는 지 찾는다
   2. 토큰이 존재하면 해당 토큰을 사용하여 토픽을 구독한다
   */
  const url = `${process.env.REACT_APP_ALARM_API_URL}/api/subscribe`;
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
    },
    mode: 'cors',
    body: JSON.stringify({ token: token, topic: topic })
  }).then(r => {
  }).catch((error) => {
    console.error("구독 실패", error);
  });
}

async function unsubscribed(token, topic) {
  const url = `${process.env.REACT_APP_ALARM_API_URL}/api/subscribe`;
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
    },
    mode: 'cors',
    body: JSON.stringify({ token: token, topic: topic })
  }).catch((error) => {
    console.error("구독 해제 실패", error);
  });
}

async function checkTokenTimeStamps(token) {
  /*
  1. 토큰의 시간이 한 달이 지났는지 확인한다.
  2. 한 달이 지났으면 새로운 토큰을 생성하고 시간을 업데이트한다.
  3. 한 달이 지나지 않았으면 토큰을 그대로 사용한다.
   */
  const url = `${process.env.REACT_APP_ALARM_API_URL}/api/timestamp?token=${token}`;
  const { data, error } = fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
    },
    mode: 'cors',
  }).then(r => r.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("토큰 타임스탬프 확인 실패", error);
      return { error: true };
    })
  if (!error && data) {
    console.log('토큰이 만료됨');
    const date = new Date(); // 현재 날짜 및 시간
    // "yyyy-mm-dd" 형식으로 변환
    const newTime = date.toISOString().split('T')[0];
    await deleteToken(messaging);
    const newToken = await getToken(messaging);
    await fetch(`${process.env.REACT_APP_ALARM_API_URL}/api/timestamp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
      },
      mode: 'cors',
      body: JSON.stringify({ oldToken: token, newToken, newTime })
    });
    return { newToken, newTime };
  }
  return { newToken: token, newTime: "" };
}

async function createTokenAndTime() {
  try {
    const newToken = await getToken(messaging);
    const date = new Date(); // 현재 날짜 및 시간
    const newTime = date.toISOString().split('T')[0]; // "2023-04-22"
    return { newToken, newTime };
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
}

async function requestPermission() {
  console.log('Requesting permission...');
  try {
    await Notification.requestPermission();
    const { newToken, newTime } = await createTokenAndTime();
    console.log("Permission granted");
    await fetch(`${process.env.REACT_APP_ALARM_API_URL}/api/permission`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
      },
      body: JSON.stringify({ token: newToken, time: newTime })
    }).then(r => {
      console.log(r);
    }).catch((error) => {
      console.error("알람 권한 요청 실패", error);
    }
    );
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
