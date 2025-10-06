import * as DOMPurify from 'isomorphic-dompurify';

export function sanitizeContent(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  const TEXT_TAGS_ALLOWED = [
    'p',
    'br',
    'strong',
    'em',
    'u',
    's',
    'del',
    'code',
    'pre',
  ];
  const HEADING_TAGS_ALLOWED = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const LIST_TAGS_ALLOWED = ['ul', 'ol', 'li'];
  const LINK_TAGS_ALLOWED = ['a'];
  const IMAGE_TAGS_ALLOWED = ['img'];
  const BLOCKQUOTE_TAGS_ALLOWED = ['blockquote'];
  const TABLE_TAGS_ALLOWED = [
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'blockquote',
  ];
  const DIV_TAGS_ALLOWED = ['div', 'span', 'hr'];

  const config = {
    ALLOWED_TAGS: [
      ...TEXT_TAGS_ALLOWED,
      ...HEADING_TAGS_ALLOWED,
      ...LIST_TAGS_ALLOWED,
      ...LINK_TAGS_ALLOWED,
      ...IMAGE_TAGS_ALLOWED,
      ...BLOCKQUOTE_TAGS_ALLOWED,
      ...TABLE_TAGS_ALLOWED,
      ...DIV_TAGS_ALLOWED,
    ],
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'title',
      'class',
      'id',
      'target',
      'rel',
      'width',
      'height',
    ],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
  };

  const sanitized = DOMPurify.sanitize(content, config);

  return sanitized.trim();
}

export function isValidContent(content: string): boolean {
  const sanitized = sanitizeContent(content);
  return sanitized.length > 0;
}
