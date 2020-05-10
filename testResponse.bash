for (( i = 0; i < $1; i++ )); do
  if [ "$2" ]; then
      curl -L -s -X POST --data 'uri=https://google.com' "$2"
      echo
    fi
done
