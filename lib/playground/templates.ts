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
    {
      label: "sort.c",
      source: `#include <stdio.h>
#include <stdlib.h>

int compare(const void* left, const void* right) {
    int a = *(const int*)left;
    int b = *(const int*)right;
    return (a > b) - (a < b);
}

int main(void) {
    int count = 0;
    if (scanf("%d", &count) != 1) {
        return 1;
    }

    int* values = (int*)malloc((size_t)count * sizeof(int));
    if (!values) {
        return 1;
    }

    for (int i = 0; i < count; i++) {
        scanf("%d", &values[i]);
    }

    qsort(values, (size_t)count, sizeof(int), compare);

    for (int i = 0; i < count; i++) {
        printf("%d ", values[i]);
    }
    printf("\\n");

    free(values);
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
    {
      label: "regex.cpp",
      source: `#include <iostream>
#include <regex>
#include <string>

int main() {
    std::string line;
    if (!std::getline(std::cin, line)) {
        return 1;
    }

    std::regex pattern(R"(\\b\\d+\\b)");
    std::sregex_iterator begin(line.begin(), line.end(), pattern);
    std::sregex_iterator end;

    for (auto it = begin; it != end; ++it) {
        std::cout << (*it).str() << "\\n";
    }

    return 0;
}`,
    },
    {
      label: "json.cpp",
      source: `#include <iostream>
#include <string>

int main() {
    std::string json;
    if (!std::getline(std::cin, json)) {
        return 1;
    }

    const std::string key = "\\"name\\":\\"";
    const auto start = json.find(key);
    if (start == std::string::npos) {
        std::cerr << "name key not found\\n";
        return 1;
    }

    const auto valueStart = start + key.size();
    const auto valueEnd = json.find('"', valueStart);
    if (valueEnd == std::string::npos) {
        std::cerr << "invalid json string\\n";
        return 1;
    }

    std::cout << json.substr(valueStart, valueEnd - valueStart) << "\\n";
    return 0;
}`,
    },
  ],
};

export function getDefaultSource(language: PlaygroundLanguage): string {
  return templates[language][0].source;
}
