export const PUBLICATION_STATUSES = ['draft', 'needs_review', 'published', 'archived'];

const transitions = Object.freeze({
  draft: ['draft', 'needs_review', 'published', 'archived'],
  needs_review: ['needs_review', 'draft', 'published', 'archived'],
  published: ['published', 'draft', 'archived'],
  archived: ['archived', 'draft']
});

export function allowedPublicationStatuses(currentStatus = 'draft') {
  return transitions[currentStatus] || transitions.draft;
}

export function isPublicPart(part) {
  return (part.publication_status || 'published') === 'published';
}
