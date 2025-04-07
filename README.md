1. Install repo:
```sh
git clone https://github.com/tripchanski/BlackLock.git
```
2. Up containers:
```sh
docker compose up -d --build
```
3. Go to container:
```sh
docker exec -it blacklock-app-1 bash
```
4. Launch app:
```sh
npx expo start --tunnel
```
