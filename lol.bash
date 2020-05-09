for (( i = 0; i < 100000; i++ )); do
  curl -X POST -F 'uri=https://google.com' localhost:8888/
done