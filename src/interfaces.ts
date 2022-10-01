export type HTMLString = string

export type AppMode = 'development' | 'production'

export interface MailerConfig {
    user: string
    password: string
    service?: string
    appMode?: AppMode
}

export interface ConfigureTransportOptions {
    transportHeaders: Record<string, string>
}

export interface ConfigureMailsOptions {
    mailSubjects: any
    emailHTMLs: any
}
