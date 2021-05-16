# RESTscript

🌱 There example of DSL on client!

✨ Implementation of RESTscript with executor with Go WASM there: [github.com/kiselev-nikolay/execute.fun](https://github.com/kiselev-nikolay/execute.fun) (serverless 😜)



![](./about/ScreenShot1.PNG)

The restscript is a DSL language to simplify the programming of a series of HTTP requests. It can fit in a couple of lines a whole program which collects data from datadog and sends it to Slack, and then runs CI/CD. It's convenient for automating routine because it runs right in your browser, which means you don't even need to think about authorization, just run the code.

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
