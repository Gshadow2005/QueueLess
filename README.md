# QueueLess — Online Queue Tracking Platform

**QueueLess** is a web-based queue management platform that lets customers track their queue position in real time — without standing in line. Users can monitor their number remotely, receive automated notifications when their turn is near, and return to the counter only when needed.

---

## Overview

Long waiting times and inefficient queue handling remain persistent challenges in service-oriented establishments such as banks, government offices, hospitals, and utility providers. Traditional queuing forces customers to wait physically in line with no visibility into how long they actually have left — leading to overcrowding, frustration, and poor service experiences.

QueueLess digitizes this process entirely. Customers get a queue number, leave freely, and are notified automatically when they are a few spots away from being served.

---

## Features

- **Real-time queue tracking** — live position updates, no refresh required
- **Now Serving display** — always know which number is currently being called
- **Automated notifications** — browser push alerts when your turn is approaching
- **Remote monitoring** — track from anywhere on any device
- **Session persistence** — active queue sessions are saved across page reloads
- **Institution browser** — searchable and filterable list of participating establishments
- **Live queue statistics** — serving number, people in queue, and estimated wait time per institution
- **Done screen with rating** — session summary and experience feedback after being served

---

## How It Works

```
1. Browse and select an institution (bank, government office, utility provider)
2. Pick up a physical ticket at the counter
3. Enter your ticket number into QueueLess
4. Leave — grab food, run errands, or simply sit elsewhere
5. Receive a notification when you are a few spots away
6. Return just in time to be served
```

No more standing in line for the entirety of your wait.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | TypeScript, React, Vite, Tailwind CSS |
| Backend | Django (REST API) |
| Real-time | Polling via `fetch` (10s interval) |
| Notifications | Web Push API (browser notifications) |
| Deployment | Vercel (frontend) |
| Analytics | Vercel Analytics + Speed Insights |

---

## Target Establishments

- Banks and financial institutions
- Government offices and public service centers
- Hospitals and clinics
- Utility service providers
- Any establishment with structured walk-in queuing

---

## Team

| Name | Role |
|---|---|
| Glenn Mark R. Anino | Frontend Developer |
| Den Jester B. Antonio | Frontend Developer |
| John Cyril G. Espina | Backend Developer |
| Sophia Marie M. Flores | UI/UX Designer |
| John Jaybird L. Casia | UI/UX Designer |

---

## License

This project is developed for educational purposes only.
