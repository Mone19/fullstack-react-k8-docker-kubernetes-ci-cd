import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 50 },  
    { duration: '5m', target: 200 },  
    { duration: '2m', target: 20 },    
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% der Anfragen müssen unter 200ms sein
  },
};

export default function () {
  let res = http.get('https://www.aiq-blog.de');
  check(res, {
    'response time is less than 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}
