#!/usr/bin/env python3

import json
import sys
import requests
import re

def main():
    input_str = sys.stdin.readlines()
    data = json.loads(''.join(input_str))
    for category in data['categories']:
        for obj in category['items']:
            myfile = requests.get(data['url_prefix'] + obj['file'])
            myfile_content = myfile.content.decode('utf8')
            # remove imports from core.futil
            processed = re.sub(r'(?m)^import "primitives/core\.futil";.*\n?', '', myfile_content)
            obj['content'] = processed.strip()
    print(json.dumps(data))

if __name__ == "__main__":
    main()
