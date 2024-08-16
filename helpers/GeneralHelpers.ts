export const formatLink = (link: string | undefined) => {
  if (link?.includes && !link.includes("http")) {
    return `https://${link}`;
  }
  return link;
};

export const classNames = (...classes: string[]) => {
  return classes.filter((c) => !!c).join(" ");
};
