// gh-pages serves a project site from /<repo>/, so the default base of "/" makes
// every hashed asset resolve against the domain root and 404. Relative URLs work
// from any path, including a local preview.
export default { base: './' };
