# hans-mailer
nodemailer wrapper

## Table of contents
* [Installing](#installing)
* [Example](#example)

<a name="installing"><h2>Installing</h2></a>
Add the package to your project
```
npm i hans-mailer
```
using yarn
```
yarn add hans-mailer
```


<a name="example"><h2>Example</h2></a>

Export Mailer from *hans-mailer*

```javascript
const Mailer = require('hans-mailer')
const {HTMLString} = require('hans-mailer')
```
using TypeScript
```typescript
import Mailer, {HTMLString} from 'hans-mailer'
```

In init mailer file
```typescript

export function email1({name}: {name: string}): HTMLString {
    return `<div>Hello, ${name} this is Email 1</div>`
}

export function email2(): HTMLString {
    return '<div>Email 2</div>'
}

export const emailHTMLs = {
    email1,
    email2,
}

const mailSubjects = {
    email1: 'Subject of email 1',
    email2: 'Subject of email 2',
}

const mailer = new Mailer({
    user: 'sender_email',
    password: 'sender_email_passwrod',
    service: 'any_service',
    appMode: process.env.NODE_ENV // for using test email in development mode
})
mailer.configureTransport({transportHeaders: {'Access-Control-Allow-Origin': '*'}})
// below it is necessary to match keys at mailSubjects and emailHTMLs
mailer.configureMails({
    mailSubjects,
    emailHTMLs
})
mailer.setTestEmail('test.email@test.com') // for development

export default mailer
```

When use *mailer object*

```typescript
mailer.setEmailTo('john.mailer@inbox.lv') // in production mode
mailer.setEmailOptions({name: 'John'})
mailer.setTargetEmailName('email1') // 
await mailer.send()

mailer.setEmailTo('helena.mailer@inbox.lv') // in production mode
mailer.setEmailOptions()
mailer.setTargetEmailName('email2') // 
await mailer.send()
```
