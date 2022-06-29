export { matchers } from './client-matchers.js';

export const components = [
	() => import("../runtime/components/layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/presentation.svelte"),
	() => import("../../src/routes/style-transfer.svelte")
];

export const dictionary = {
	"": [[0, 2], [1]],
	"presentation": [[0, 3], [1]],
	"style-transfer": [[0, 4], [1]]
};