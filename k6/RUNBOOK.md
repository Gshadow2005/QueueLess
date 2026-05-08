# Basic single user
& "C:\Program Files\k6\k6.exe" run k6/browser-flow.js

# 3 users with tickets 20, 21, 22
& "C:\Program Files\k6\k6.exe" run -e VUS=3 -e TICKET_BASE=20 k6/browser-flow.js

# Custom URL (e.g. PR preview)
& "C:\Program Files\k6\k6.exe" run -e BASE_URL=https://queueless-ph.vercel.app k6/browser-flow.js