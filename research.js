/*
 * Shared renderer for Publications and Presentations.
 * Add entries to data/publications.json or data/presentations.json.
 */

function makeTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function makeResearchCard(item) {
  const card = document.createElement("article");
  card.className = "research-card";

  card.appendChild(makeTextElement("div", "research-year", item.year));

  const content = document.createElement("div");
  content.className = "research-content";
  content.appendChild(makeTextElement("h3", "", item.title));

  if (item.authors) {
    const authors = document.createElement("p");
    authors.className = "authors";
    authors.innerHTML = item.authors;
    content.appendChild(authors);
  }
  // Conference name and location
  if (item.venue || item.location) {
    const venue = document.createElement("p");
    venue.className = "venue";
    venue.textContent = [item.venue, item.location]
      .filter(Boolean)
      .join(" · ");

    content.appendChild(venue);
  }

  // Conference and presentation type tags
  const tagLabels = [item.conference, item.type].filter(Boolean);

  if (tagLabels.length) {
    const tags = document.createElement("div");
    tags.className = "research-tags";

    tagLabels.forEach((label) => {
      const tag = document.createElement("span");
      tag.className = "research-tag";
      tag.textContent = label;
      tags.appendChild(tag);
    });

    content.appendChild(tags);
  }

  if (Array.isArray(item.links) && item.links.length) {
    const links = document.createElement("div");
    links.className = "paper-links";

    item.links.forEach(linkInfo => {
      if (!linkInfo.url || !linkInfo.label) return;
      const link = document.createElement("a");
      link.href = linkInfo.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      if (linkInfo.icon) {
        const icon = document.createElement("i");
        icon.className = linkInfo.icon;
        icon.setAttribute("aria-hidden", "true");
        link.appendChild(icon);
      }
      link.appendChild(document.createTextNode(
        `${linkInfo.icon ? " " : ""}${linkInfo.label}`
      ));
      links.appendChild(link);
    });

    if (links.childElementCount) content.appendChild(links);
  }

  card.appendChild(content);
  return card;
}

async function loadResearch(jsonPath, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const entries = await response.json();
    entries.sort((a, b) => Number(b.year) - Number(a.year));

    if (!entries.length) {
      container.appendChild(makeTextElement("p", "research-empty", "No entries yet."));
      return;
    }
    entries.forEach(item => container.appendChild(makeResearchCard(item)));
  } catch (error) {
    console.error(`Could not load ${jsonPath}:`, error);
    container.appendChild(
      makeTextElement("p", "research-error", "Unable to load this section.")
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadResearch("data/publications.json", "publications-list");
  loadResearch("data/presentations.json", "presentations-list");
});
