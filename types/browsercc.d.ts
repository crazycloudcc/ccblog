declare module "browsercc/dist/clang.js" {
  type ClangModule = Record<string, unknown>;

  export default function Clang(module?: ClangModule): Promise<ClangModule>;
}

declare module "browsercc/dist/lld.js" {
  type LldModule = Record<string, unknown>;

  export default function LLD(module?: LldModule): Promise<LldModule>;
}
