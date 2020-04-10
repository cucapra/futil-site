#!/usr/bin/env python3

import json
import sys
import requests

def main():
    input_str = sys.stdin.readlines()
    data = json.loads(''.join(input_str))
    for category in data['categories']:
        for obj in category['items']:
            myfile = requests.get(data['url_prefix'] + obj['file'])
            obj['content'] = myfile.content.decode('utf8')
    print(json.dumps(data))

if __name__ == "__main__":
    main()
