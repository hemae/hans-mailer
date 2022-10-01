import nodemailer, {Transporter} from 'nodemailer'
import {
    AppMode,
    ConfigureMailsOptions,
    ConfigureTransportOptions,
    HTMLString,
    MailerConfig
} from './interfaces'
import log from 'hans-logger'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export * from './interfaces'


export default class Mailer {

    private _user: string
    private _password: string
    private _service: string
    private _appMode: AppMode
    private _emailName: string | null
    private _emailHTMLOptions: Record<string, any> | void | null
    private _transportHeaders: Record<string, string> = {}
    private _mailSubjects: Record<string, string> | null
    private _emailHTMLs: Record<string, (options: Record<string, any> | void) => HTMLString> | null
    private _devTestEmail: string | null
    private _emailTo: string | null

    constructor(mailerConfig: MailerConfig) {

        const {
            user,
            password,
            service,
            appMode
        } = mailerConfig

        this._user = user
        this._password = password
        this._service = service || 'yandex'
        this._appMode = appMode || 'production'

        this._emailHTMLs = null
        this._mailSubjects = null
        this._devTestEmail = null
        this._emailName = null
        this._emailHTMLOptions = null
        this._emailTo = null
    }

    public configureTransport(options: ConfigureTransportOptions | void): void {
        if (options) {
            const {
                transportHeaders
            } = options
            this._transportHeaders = transportHeaders
        }
    }

    public configureMails<MailSubjects extends string>(options: ConfigureMailsOptions): void {
        const {
            mailSubjects,
            emailHTMLs
        } = options
        this._mailSubjects = mailSubjects as Record<MailSubjects, MailSubjects>
        this._emailHTMLs = emailHTMLs
    }

    public setTestEmail(testEmail: string): void {
        this._devTestEmail = testEmail
    }

    public setTargetEmailName(emailName: string): void {
        this._emailName = emailName
    }

    public setEmailOptions(emailHTMLOptions: Record<string, any>): void {
        this._emailHTMLOptions = emailHTMLOptions
    }

    public setEmailTo(emailTo: string): void {
        this._emailTo = emailTo
    }

    public async send(): Promise<void> {
        await this._sendEmail()
    }

    private _getTransport(): Transporter<SMTPTransport.SentMessageInfo> {
        return nodemailer.createTransport(
            {service: this._service, auth: {user: this._user, pass: this._password}},
            {from: this._user, headers: this._transportHeaders}
        )
    }

    private _getHTML(): HTMLString | null {
        if (!this._emailName) throw new Error('"emailName" is not defined, use method "setTargetEmailName"')
        if (this._emailHTMLOptions === null) throw new Error('"emailHTMLOptions" is not defined, use method "setEmailOptions"')
        return this._emailHTMLs?.[this._emailName]?.(this._emailHTMLOptions) || null
    }

    private _getSubject(): string | undefined {
        if (!this._emailName) throw new Error('"emailName" is not defined, use method "setTargetEmailName"')
        //@ts-ignore
        return this._mailSubjects?.[this._emailName]
    }

    private async _sendEmail(): Promise<void> {
        try {
            log.info('User is ' + this._user)
            await this._implementEmail()
        } catch (error: any) {
            log.error(error)
            throw new Error(`mail-error, ${this._emailName}, file: ${__filename}`)
        }
    }

    private async _implementEmail(): Promise<void> {
        const html = this._getHTML()
        if (html === null) throw new Error('"html" or "emailName" is not defined, use method "setTargetEmailName"')
        if (!this._emailTo && !this._devTestEmail) throw new Error('"email to" is not defined, use method "setEmailTo" or "setTestEmail"')
        await this._getTransport().sendMail({
            to: (this._appMode === 'development' && this._devTestEmail) ? this._devTestEmail : (this._emailTo || this._devTestEmail!),
            subject: this._getSubject() || 'Without subject',
            html
        })
    }
}
