/**
 * Link-preview crawlers (WhatsApp, Messenger/Threads, Telegram, X, Slack,
 * iMessage, LinkedIn, Discord). They only read <head> meta tags and give up
 * after a few seconds, so product URLs serve them a tiny HTML shell instead
 * of the full page. Search engines are deliberately NOT matched: Google must
 * keep seeing the real page.
 *
 * Dependency-free on purpose: imported by proxy.ts (edge bundle).
 */
const LINK_PREVIEW_BOT = /WhatsApp|facebookexternalhit|Facebot|Twitterbot|TelegramBot|Slackbot|LinkedInBot|Discordbot|Applebot|Pinterest|Snapchat|SkypeUriPreview|viber/i

export function isLinkPreviewBot(userAgent: string | null | undefined): boolean {
  return !!userAgent && LINK_PREVIEW_BOT.test(userAgent)
}
