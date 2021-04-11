# REST script

![](./about/ScreenShot1.PNG)

This repository example of DSL language right in browser (serverless). REST script need to execute HTTP request with automatic get-response parsing, and simpe data posting.

### This code:

```
get as author https://api.github.com/repos/kiselev-nikolay/execute.fun/commits
set header "Authorization" "Bearer xoxb-1234-56789abcdefghijklmnop"
post json text=author https://slack.com/api/chat.postMessage
post params author myserver.com/ci-cd
```

### Compiled to abstract tree, wich can be executed:

```
{
  "cmd": {
    "action": "get",
    "define": {
      "keyword": "as",
      "variables": {
        "key": "author"
      }
    },
    "link": {
      "protocol": "",
      "url": "https://api.github.com/repos/kiselev-nikolay/execute.fun/commits"
    }
  },
  "next": {
    "cmd": {
      "action": "set header",
      "key": "Authorization",
      "value": "Bearer xoxb-1234-56789abcdefghijklmnop"
    },
    "next": {
      "cmd": {
        "action": "post",
        "define": {
          "keyword": "json",
          "variables": {
            "key": "text",
            "from": "author"
          }
        },
        "link": {
          "protocol": "",
          "url": "https://slack.com/api/chat.postMessage"
        }
      },
      "next": {
        "cmd": {
          "action": "post",
          "define": {
            "keyword": "params",
            "variables": {
              "key": "author"
            }
          },
          "link": {
            "protocol": "",
            "url": "myserver.com/ci-cd"
          }
        }
      }
    }
  }
}
```