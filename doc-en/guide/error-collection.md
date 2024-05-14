# Introduction

Implementing global error collection helps us to promptly gather error information. Especially in production environments, being able to collect error logs from user interactions in real-time is crucial. Handling errors promptly improves system reliability and user experience, ultimately reducing unnecessary losses for the company. Therefore, implementing global error collection is of great importance.

In this article, we will discuss how to elegantly collect errors.

## Types of Error Logs

1. **JS Runtime Errors**:
    - Normal JavaScript runtime errors like `throw new Error("JS runtime error")`.

2. **Resource Loading Errors**:
    - Errors related to loading resources like images, scripts, or stylesheets (`img`, `script`, `link`).

3. **Unhandled Promise Rejections**:
    - Errors occurring from unhandled promise rejections after calling `reject` on a promise without a `catch` handler.

4. **`console.error` Errors**:
    - Errors logged using `console.error`.

5. **Request Errors (Cross-Origin, 401, 404, 500)**:
    - Errors generated from AJAX requests or `fetch`, such as cross-origin errors, 401 unauthorized, 404 not found, etc.

Now, let's see how to collect these errors in detail.

## Error Log Experience

[Try it out](https://github.jzfai.top/vue3-admin-plus/#/error-log/error-log)

## Framework Integration Principle

#### Installation

Install the error log collection dependency:

```json
"js-error-collection": "^1.0.7"
```

#### Configuration

**src/hooks/use-error-log.js**:

```javascript
const errorLogReq = (errLog) => {
  axiosReq({
    url: import.meta.env.VITE_APP_BASE_URL + reqUrl,
    data: {
      pageUrl: window.location.href,
      errorLog: errLog,
      browserType: navigator.userAgent,
      version: pack.version
    },
    method: 'post'
  }).then(() => {
    bus.emit('reloadErrorPage', {})
  })
}

export const useErrorLog = () => {
  if (settings.errorLog?.includes(import.meta.env.VITE_APP_ENV)) {
    jsErrorCollection({ runtimeError: true, rejectError: true, consoleError: true }, (errLog) => {
      if (!repeatErrorLogJudge || !errLog.includes(repeatErrorLogJudge)) {
        errorLogReq(errLog)
        repeatErrorLogJudge = errLog.slice(0, 20)
      }
    })
  }
}
```

### Integration

**src/App.vue**:

```typescript
onMounted(() => {
  useErrorLog()
})
```

## How to Enable Error Log Collection

In the **src/settings.js** file, you can configure the environments where error logs should be collected:

```typescript
errorLog: ['prod']
```

By default, error log collection is enabled only in the production environment. If you want to disable error log collection entirely, set `errorLog: []`.
