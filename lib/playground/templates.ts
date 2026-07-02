import type { PlaygroundLanguage } from "@/lib/playground/types";

export const templates: Record<PlaygroundLanguage, { label: string; source: string }[]> = {
  c: [
    {
      label: "hello.c",
      source: `#include <stdio.h>

int main(void) {
    printf("Hello, World\\n");
    return 0;
}`,
    },
    {
      label: "a+b.c",
      source: `#include <stdio.h>

int main(void) {
    int a, b;
  if (scanf("%d %d", &a, &b) != 2) {
    return 1;
  }
    printf("%d\\n", a + b);
    return 0;
}`,
    },
  ],
  cpp: [
    {
      label: "hello.cpp",
      source: `#include <iostream>

int main() {
    std::cout << "Hello, World\\n";
    return 0;
}`,
    },
    {
      label: "a+b.cpp",
      source: `#include <iostream>

int main() {
    int a, b;
    if (!(std::cin >> a >> b)) {
        return 1;
    }
    std::cout << a + b << "\\n";
    return 0;
}`,
    },
    {
      label: "sort.cpp",
      source: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    int n;
    if (!(std::cin >> n)) {
        return 1;
    }
    std::vector<int> values(n);
    for (int& value : values) {
        std::cin >> value;
    }
    std::sort(values.begin(), values.end());
    for (int value : values) {
        std::cout << value << " ";
    }
    std::cout << "\\n";
    return 0;
}`,
    },
  ],
};

export function getDefaultSource(language: PlaygroundLanguage): string {
  return templates[language][0].source;
}
