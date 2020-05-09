for (( i = 0; i < $1; i++ )); do
  if [ "$2" ]; then
      url="$(curl -L -s -X POST --data 'uri=https://google.com' "$2")"
      response="$(curl -s "$url")"
      if [[ "$response" == *"Found"* ]]; then
          echo success
        else
          echo failure
      fi
      else
        echo you need to pass in where you want to send the request to
    fi
done
echo done
