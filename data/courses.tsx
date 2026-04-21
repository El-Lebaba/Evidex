/**
 * COURSE DATA STRUCTURE
 *
 * To add a new course:
 * 1. Create a new object following the structure below
 * 2. Each course has slides[] - each slide has theory + animation config
 * 3. Push it into the COURSES array
 *
 * Animation types:
 * - "gate"       → A sphere approaches a gate (true/false logic)
 * - "loop"       → A carousel of items cycling through
 * - "variable"   → A box that changes its value
 * - "comparison" → Two values being compared
 * - "flow"       → Flowchart-style execution path
 */

export const COURSES = [
    {
        id: "if-statement",
        title: "The If Statement",
        subtitle: "Conditional Logic",
        icon: "🚦",
        color: "from-indigo-500 to-violet-600",
        description: "Learn how Java decides what code to run based on conditions.",
        totalSlides: 4,
        slides: [
            {
                title: "What is an If Statement?",
                theory: "An **if statement** lets your program make decisions. It checks a condition — if the condition is `true`, the code inside runs. If it's `false`, it gets skipped entirely.",
                code: `if (condition) {\n  // runs only when true\n}`,
                animation: {
                    type: "gate",
                    value: 50,
                    condition: "value > 100",
                    result: false,
                    label: "The sphere is 50 — the gate requires > 100. Blocked!"
                }
            },
            {
                title: "Making It Pass",
                theory: "Now let's change the value to **150**. Since 150 is greater than 100, the condition becomes `true` and the code inside the if block **executes**.",
                code: `int value = 150;\nif (value > 100) {\n  System.out.println("Big number!");\n}`,
                animation: {
                    type: "gate",
                    value: 150,
                    condition: "value > 100",
                    result: true,
                    label: "The sphere is 150 — the gate opens! Condition is true."
                }
            },
            {
                title: "The Else Branch",
                theory: "What if the condition is false and we want to do something else? That's what `else` is for. It catches everything that doesn't match the `if`.",
                code: `int value = 30;\nif (value > 100) {\n  System.out.println("Big!");\n} else {\n  System.out.println("Small!");\n}`,
                animation: {
                    type: "gate",
                    value: 30,
                    condition: "value > 100",
                    result: false,
                    label: "Value is 30 — it takes the else path instead."
                }
            },
            {
                title: "Else If — Multiple Paths",
                theory: "You can chain conditions with `else if`. Java checks each one in order and runs the **first** one that's true.",
                code: `int score = 75;\nif (score >= 90) {\n  System.out.println("A");\n} else if (score >= 70) {\n  System.out.println("B");\n} else {\n  System.out.println("C");\n}`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "score >= 90", result: false },
                        { label: "score >= 70", result: true, output: "B" },
                        { label: "else", result: false }
                    ],
                    label: "Score is 75 → skips first, matches second → prints B"
                }
            }
        ]
    },
    {
        id: "variables",
        title: "Variables",
        subtitle: "Data Storage",
        icon: "📦",
        color: "from-emerald-500 to-teal-600",
        description: "Understand how Java stores and manages data in memory.",
        totalSlides: 4,
        slides: [
            {
                title: "What is a Variable?",
                theory: "A **variable** is a named container that stores a value. Think of it like a labeled box — you give it a name and put something inside.",
                code: `int age = 25;`,
                animation: {
                    type: "variable",
                    varName: "age",
                    varType: "int",
                    value: 25,
                    label: "A box labeled 'age' now holds the value 25."
                }
            },
            {
                title: "Changing Values",
                theory: "Variables can be **reassigned**. The old value disappears and the new one takes its place.",
                code: `int age = 25;\nage = 30; // now it's 30`,
                animation: {
                    type: "variable",
                    varName: "age",
                    varType: "int",
                    value: 30,
                    previousValue: 25,
                    label: "The box 'age' updates from 25 → 30."
                }
            },
            {
                title: "Types of Variables",
                theory: "Java is **strongly typed** — every variable must declare its type. Common types: `int` (whole numbers), `double` (decimals), `String` (text), `boolean` (true/false).",
                code: `int count = 10;\ndouble price = 9.99;\nString name = "Java";\nboolean active = true;`,
                animation: {
                    type: "variable",
                    varName: "name",
                    varType: "String",
                    value: '"Java"',
                    label: "Different types of boxes for different types of data."
                }
            },
            {
                title: "Final Variables",
                theory: "Adding `final` makes a variable **constant** — it can never be changed after being set. Use it for values that shouldn't change.",
                code: `final double PI = 3.14159;\n// PI = 3.0; ← ERROR!`,
                animation: {
                    type: "variable",
                    varName: "PI",
                    varType: "final double",
                    value: 3.14159,
                    locked: true,
                    label: "This box is sealed shut — no changes allowed!"
                }
            }
        ]
    },
    {
        id: "for-loop",
        title: "For Loops",
        subtitle: "Iteration Basics",
        icon: "🔄",
        color: "from-amber-500 to-orange-600",
        description: "Repeat code a specific number of times with for loops.",
        totalSlides: 4,
        slides: [
            {
                title: "The For Loop Structure",
                theory: "A `for` loop repeats a block of code a set number of times. It has three parts: **initialization**, **condition**, and **increment**.",
                code: `for (int i = 0; i < 5; i++) {\n  System.out.println(i);\n}`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 5,
                    items: [0, 1, 2, 3, 4],
                    label: "The loop runs 5 times: i goes from 0 to 4."
                }
            },
            {
                title: "Loop Counting",
                theory: "The variable `i` starts at 0, and after each iteration it increases by 1. When `i` reaches 5, the condition `i < 5` is false and the loop stops.",
                code: `// Iteration 1: i = 0 → print 0\n// Iteration 2: i = 1 → print 1\n// ...\n// Iteration 5: i = 4 → print 4\n// i = 5 → STOP`,
                animation: {
                    type: "loop",
                    current: 3,
                    max: 5,
                    items: [0, 1, 2, 3, 4],
                    highlightIndex: 3,
                    label: "Currently on iteration 4 (i = 3)."
                }
            },
            {
                title: "Custom Step Size",
                theory: "You can change how much `i` increases each time. Using `i += 2` makes it skip every other number.",
                code: `for (int i = 0; i < 10; i += 2) {\n  System.out.println(i);\n}\n// Output: 0, 2, 4, 6, 8`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 10,
                    items: [0, 2, 4, 6, 8],
                    label: "Stepping by 2: only even numbers."
                }
            },
            {
                title: "Nested Loops",
                theory: "You can put a loop inside another loop. The **inner loop** runs completely for each iteration of the outer loop.",
                code: `for (int i = 0; i < 3; i++) {\n  for (int j = 0; j < 2; j++) {\n    System.out.println(i + "," + j);\n  }\n}`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 6,
                    items: ["0,0", "0,1", "1,0", "1,1", "2,0", "2,1"],
                    label: "3 outer × 2 inner = 6 total iterations."
                }
            }
        ]
    },
    {
        id: "while-loop",
        title: "While Loops",
        subtitle: "Conditional Repetition",
        icon: "⏳",
        color: "from-rose-500 to-pink-600",
        description: "Keep running code as long as a condition is true.",
        totalSlides: 3,
        slides: [
            {
                title: "The While Loop",
                theory: "A `while` loop keeps running **as long as** a condition is true. Unlike `for`, you don't always know how many times it'll run.",
                code: `int count = 0;\nwhile (count < 3) {\n  System.out.println(count);\n  count++;\n}`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 3,
                    items: [0, 1, 2],
                    label: "Keeps going while count < 3."
                }
            },
            {
                title: "Infinite Loops (Danger!)",
                theory: "If the condition **never** becomes false, the loop runs forever. This is called an **infinite loop** — it will crash your program.",
                code: `// DON'T DO THIS!\nwhile (true) {\n  System.out.println("Forever!");\n}`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 999,
                    items: ["♾️", "♾️", "♾️", "♾️", "♾️"],
                    label: "Danger! This never stops."
                }
            },
            {
                title: "Do-While Loop",
                theory: "A `do-while` loop runs the code **at least once**, then checks the condition. The check happens at the end, not the beginning.",
                code: `int x = 10;\ndo {\n  System.out.println(x);\n  x++;\n} while (x < 3);\n// Prints 10 (runs once!)`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 1,
                    items: [10],
                    label: "Runs once even though 10 < 3 is false."
                }
            }
        ]
    },
    {
        id: "methods",
        title: "Methods",
        subtitle: "Reusable Code",
        icon: "⚡",
        color: "from-cyan-500 to-blue-600",
        description: "Write code once, use it many times with methods.",
        totalSlides: 4,
        slides: [
            {
                title: "What is a Method?",
                theory: "A **method** is a block of code with a name. Instead of writing the same code over and over, you write it once and **call** it whenever you need it.",
                code: `public static void greet() {\n  System.out.println("Hello!");\n}\n\n// Call it:\ngreet(); // prints "Hello!"`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "main()", result: true },
                        { label: "→ greet()", result: true, output: "Hello!" }
                    ],
                    label: "main() calls greet(), which prints Hello!"
                }
            },
            {
                title: "Parameters",
                theory: "Methods can accept **parameters** — values you pass in when calling them. This makes them flexible.",
                code: `public static void greet(String name) {\n  System.out.println("Hello " + name);\n}\n\ngreet("Alice"); // Hello Alice\ngreet("Bob");   // Hello Bob`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: 'greet("Alice")', result: true, output: "Hello Alice" },
                        { label: 'greet("Bob")', result: true, output: "Hello Bob" }
                    ],
                    label: "Same method, different input → different output."
                }
            },
            {
                title: "Return Values",
                theory: "Methods can **return** a value back to whoever called them. Use a return type instead of `void`.",
                code: `public static int add(int a, int b) {\n  return a + b;\n}\n\nint result = add(3, 7); // result = 10`,
                animation: {
                    type: "variable",
                    varName: "result",
                    varType: "int",
                    value: 10,
                    label: "add(3, 7) computes and returns 10."
                }
            },
            {
                title: "Method Overloading",
                theory: "You can have multiple methods with the **same name** but different parameters. Java picks the right one based on what you pass in.",
                code: `static int add(int a, int b) {\n  return a + b;\n}\nstatic double add(double a, double b) {\n  return a + b;\n}\n\nadd(3, 7);      // calls int version\nadd(3.5, 2.1);  // calls double version`,
                animation: {
                    type: "comparison",
                    left: { label: "add(3, 7)", value: "int → 10" },
                    right: { label: "add(3.5, 2.1)", value: "double → 5.6" },
                    label: "Same name, different types → different method."
                }
            }
        ]
    },
    {
        id: "arrays",
        title: "Arrays",
        subtitle: "Data Collections",
        icon: "📊",
        color: "from-violet-500 to-purple-600",
        description: "Store multiple values in a single variable.",
        totalSlides: 3,
        slides: [
            {
                title: "Creating an Array",
                theory: "An **array** holds multiple values of the same type. Each value has an **index** starting from 0.",
                code: `int[] numbers = {10, 20, 30, 40, 50};\n\nSystem.out.println(numbers[0]); // 10\nSystem.out.println(numbers[2]); // 30`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 5,
                    items: [10, 20, 30, 40, 50],
                    label: "5 slots, indexed 0 through 4."
                }
            },
            {
                title: "Modifying Elements",
                theory: "You can change any element by accessing its index and assigning a new value.",
                code: `int[] numbers = {10, 20, 30};\nnumbers[1] = 99;\n// Now: {10, 99, 30}`,
                animation: {
                    type: "variable",
                    varName: "numbers[1]",
                    varType: "int",
                    value: 99,
                    previousValue: 20,
                    label: "Index 1 changes from 20 → 99."
                }
            },
            {
                title: "Looping Through Arrays",
                theory: "Use a `for` loop to go through every element. The array's `.length` property tells you how many elements it has.",
                code: `int[] nums = {10, 20, 30};\nfor (int i = 0; i < nums.length; i++) {\n  System.out.println(nums[i]);\n}`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 3,
                    items: [10, 20, 30],
                    label: "Loop visits each element one by one."
                }
            }
        ]
    },
    {
        id: "strings",
        title: "Strings",
        subtitle: "Text Handling",
        icon: "💬",
        color: "from-sky-500 to-blue-600",
        description: "Work with text data in Java.",
        totalSlides: 3,
        slides: [
            {
                title: "Creating Strings",
                theory: "A `String` is a sequence of characters wrapped in double quotes. Strings are **objects** in Java, not primitive types.",
                code: `String greeting = "Hello, World!";\nSystem.out.println(greeting);`,
                animation: {
                    type: "variable",
                    varName: "greeting",
                    varType: "String",
                    value: '"Hello, World!"',
                    label: "A String variable holding text."
                }
            },
            {
                title: "String Methods",
                theory: "Strings come with useful methods: `.length()` gives the length, `.toUpperCase()` converts to uppercase, `.substring()` extracts a portion.",
                code: `String s = "Hello";\ns.length();        // 5\ns.toUpperCase();   // "HELLO"\ns.substring(0, 3); // "Hel"`,
                animation: {
                    type: "comparison",
                    left: { label: ".toUpperCase()", value: '"HELLO"' },
                    right: { label: ".substring(0,3)", value: '"Hel"' },
                    label: "Methods transform strings without changing the original."
                }
            },
            {
                title: "String Concatenation",
                theory: "Use `+` to join strings together. You can also combine strings with other types — Java automatically converts them.",
                code: `String first = "Hello";\nString second = "World";\nString full = first + " " + second;\n// "Hello World"\n\nint age = 25;\nString msg = "Age: " + age;\n// "Age: 25"`,
                animation: {
                    type: "variable",
                    varName: "full",
                    varType: "String",
                    value: '"Hello World"',
                    label: "Two strings joined into one."
                }
            }
        ]
    },
    {
        id: "classes",
        title: "Classes & Objects",
        subtitle: "OOP Basics",
        icon: "🏗️",
        color: "from-fuchsia-500 to-pink-600",
        description: "Build your own types with classes and objects.",
        totalSlides: 4,
        slides: [
            {
                title: "What is a Class?",
                theory: "A **class** is a blueprint for creating objects. It defines what data (fields) and behavior (methods) an object will have.",
                code: `public class Dog {\n  String name;\n  int age;\n\n  void bark() {\n    System.out.println("Woof!");\n  }\n}`,
                animation: {
                    type: "variable",
                    varName: "Dog",
                    varType: "class",
                    value: "{ name, age, bark() }",
                    label: "A blueprint with fields and methods."
                }
            },
            {
                title: "Creating Objects",
                theory: "Use `new` to create an **instance** of a class. Each object has its own copy of the fields.",
                code: `Dog myDog = new Dog();\nmyDog.name = "Rex";\nmyDog.age = 3;\nmyDog.bark(); // "Woof!"`,
                animation: {
                    type: "variable",
                    varName: "myDog",
                    varType: "Dog",
                    value: '{ name: "Rex", age: 3 }',
                    label: "An object created from the Dog blueprint."
                }
            },
            {
                title: "Constructors",
                theory: "A **constructor** is a special method that runs when you create an object. It initializes the fields.",
                code: `public class Dog {\n  String name;\n  int age;\n\n  Dog(String name, int age) {\n    this.name = name;\n    this.age = age;\n  }\n}\n\nDog d = new Dog("Rex", 3);`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: 'new Dog("Rex", 3)', result: true },
                        { label: "constructor runs", result: true },
                        { label: "object ready", result: true, output: "{ Rex, 3 }" }
                    ],
                    label: "The constructor sets up the new object."
                }
            },
            {
                title: "Multiple Objects",
                theory: "You can create as many objects from one class as you want. Each is independent with its own data.",
                code: `Dog a = new Dog("Rex", 3);\nDog b = new Dog("Max", 5);\n\na.bark(); // "Woof!"\nb.bark(); // "Woof!"\n// Same behavior, different data`,
                animation: {
                    type: "comparison",
                    left: { label: "Dog a", value: '{ "Rex", 3 }' },
                    right: { label: "Dog b", value: '{ "Max", 5 }' },
                    label: "Two objects from the same blueprint."
                }
            }
        ]
    },
    {
        id: "switch",
        title: "Switch Statement",
        subtitle: "Multi-Way Branching",
        icon: "🔀",
        color: "from-lime-500 to-green-600",
        description: "Choose between many options cleanly with switch.",
        totalSlides: 3,
        slides: [
            {
                title: "The Switch Statement",
                theory: "A `switch` checks a variable against multiple **cases**. It's cleaner than a long chain of if/else if statements.",
                code: `int day = 3;\nswitch (day) {\n  case 1: System.out.println("Mon"); break;\n  case 2: System.out.println("Tue"); break;\n  case 3: System.out.println("Wed"); break;\n  default: System.out.println("Other");\n}`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "case 1 (Mon)", result: false },
                        { label: "case 2 (Tue)", result: false },
                        { label: "case 3 (Wed)", result: true, output: "Wed" },
                        { label: "default", result: false }
                    ],
                    label: "day = 3 → matches case 3 → prints Wed"
                }
            },
            {
                title: "The Break Keyword",
                theory: "Without `break`, Java **falls through** to the next case. This is usually a bug, so always include break.",
                code: `int x = 1;\nswitch (x) {\n  case 1: System.out.println("A");\n  // no break! Falls through!\n  case 2: System.out.println("B");\n  break;\n}\n// Prints: A and B`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "case 1 → prints A", result: true, output: "A" },
                        { label: "falls to case 2 → prints B", result: true, output: "B" }
                    ],
                    label: "Without break, execution falls through!"
                }
            },
            {
                title: "Default Case",
                theory: "The `default` case runs when **none** of the other cases match. Think of it as the `else` of a switch.",
                code: `int day = 9;\nswitch (day) {\n  case 1: System.out.println("Mon"); break;\n  case 2: System.out.println("Tue"); break;\n  default: System.out.println("Unknown");\n}`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "case 1", result: false },
                        { label: "case 2", result: false },
                        { label: "default", result: true, output: "Unknown" }
                    ],
                    label: "day = 9 → no match → default runs."
                }
            }
        ]
    },
    {
        id: "boolean-logic",
        title: "Boolean Logic",
        subtitle: "True or False",
        icon: "🧠",
        color: "from-red-500 to-rose-600",
        description: "Master AND, OR, NOT and boolean expressions.",
        totalSlides: 4,
        slides: [
            {
                title: "Boolean Values",
                theory: "A `boolean` can only be **true** or **false**. They're the foundation of all decision-making in code.",
                code: `boolean isJavaFun = true;\nboolean isBoring = false;\n\nif (isJavaFun) {\n  System.out.println("Yes!");\n}`,
                animation: {
                    type: "gate",
                    value: "true",
                    condition: "isJavaFun == true",
                    result: true,
                    label: "isJavaFun is true → the gate opens!"
                }
            },
            {
                title: "AND Operator (&&)",
                theory: "The `&&` (AND) operator returns true only if **both** conditions are true. If either is false, the result is false.",
                code: `int age = 25;\nboolean hasID = true;\n\nif (age >= 18 && hasID) {\n  System.out.println("Entry allowed");\n}`,
                animation: {
                    type: "comparison",
                    left: { label: "age >= 18", value: "true ✓" },
                    right: { label: "hasID", value: "true ✓" },
                    label: "Both true → AND result is true."
                }
            },
            {
                title: "OR Operator (||)",
                theory: "The `||` (OR) operator returns true if **at least one** condition is true. Both must be false for the result to be false.",
                code: `boolean isWeekend = false;\nboolean isHoliday = true;\n\nif (isWeekend || isHoliday) {\n  System.out.println("Day off!");\n}`,
                animation: {
                    type: "comparison",
                    left: { label: "isWeekend", value: "false ✗" },
                    right: { label: "isHoliday", value: "true ✓" },
                    label: "One is true → OR result is true."
                }
            },
            {
                title: "NOT Operator (!)",
                theory: "The `!` (NOT) operator **flips** a boolean. True becomes false, false becomes true.",
                code: `boolean isRaining = false;\n\nif (!isRaining) {\n  System.out.println("Go outside!");\n}\n// !false = true → prints!`,
                animation: {
                    type: "gate",
                    value: "!false",
                    condition: "!isRaining",
                    result: true,
                    label: "NOT flips false → true. Gate opens!"
                }
            }
        ]
    }
];

export type CourseSubject = 'java' | 'math' | 'physique';

export type CourseSlide = {
    code?: string;
    theory: string;
    title: string;
};

export type LearningCourse = {
    description: string;
    id: string;
    slides: CourseSlide[];
    subtitle: string;
    title: string;
    totalSlides: number;
};

export type CourseProgressMap = Record<string, number>;

const mathCourses: LearningCourse[] = [
    {
        id: 'derivatives-basics',
        title: 'Derivees',
        subtitle: 'Taux de variation',
        description: 'Comprendre la pente instantanee, la tangente et le sens de variation.',
        totalSlides: 4,
        slides: [
            {
                title: 'Idee principale',
                theory: 'Une derivee mesure comment une quantite change quand son entree change tres peu. Sur un graphique, elle correspond a la pente de la tangente.',
                code: "f'(x) = limite quand h -> 0 de (f(x + h) - f(x)) / h",
            },
            {
                title: 'Lecture graphique',
                theory: 'Si la tangente monte, la derivee est positive. Si elle descend, la derivee est negative. Si elle est horizontale, la derivee vaut 0.',
            },
            {
                title: 'Exemple simple',
                theory: 'Pour f(x) = x^2, la derivee est f\'(x) = 2x. Au point x = 3, la pente vaut 6.',
                code: "f(x) = x^2\nf'(x) = 2x\nf'(3) = 6",
            },
            {
                title: 'Pourquoi ca sert',
                theory: 'Les derivees permettent de trouver des vitesses, des maximums, des minimums et des zones ou une fonction augmente ou diminue.',
            },
        ],
    },
    {
        id: 'integrals-basics',
        title: 'Integrales',
        subtitle: 'Aire accumulee',
        description: 'Lire une integrale comme une somme continue et une aire sous la courbe.',
        totalSlides: 3,
        slides: [
            {
                title: 'Idee principale',
                theory: 'Une integrale additionne une infinite de petites contributions. Graphiquement, elle represente souvent une aire sous une courbe.',
            },
            {
                title: 'Sommes de Riemann',
                theory: 'On approxime une integrale avec des rectangles. Plus les rectangles sont fins, plus l approximation devient precise.',
                code: 'aire approx = somme hauteur * largeur',
            },
            {
                title: 'Lien avec la derivee',
                theory: 'Integrer et deriver sont des operations inverses dans le theoreme fondamental du calcul.',
            },
        ],
    },
    {
        id: 'limits-basics',
        title: 'Limites',
        subtitle: 'Comportement local',
        description: 'Etudier ce qu une fonction approche pres d un point ou vers l infini.',
        totalSlides: 3,
        slides: [
            {
                title: 'Idee principale',
                theory: 'Une limite decrit la valeur qu une fonction approche, meme si elle ne prend pas exactement cette valeur.',
            },
            {
                title: 'Deux cotes',
                theory: 'Pour qu une limite existe en un point, la limite a gauche et la limite a droite doivent donner la meme valeur.',
            },
            {
                title: 'Vers l infini',
                theory: 'Les limites a l infini servent a comprendre le comportement global d une fonction quand x devient tres grand ou tres petit.',
            },
        ],
    },
];

const physicsCourses: LearningCourse[] = [
    {
        id: 'kinematics-basics',
        title: 'Cinematique',
        subtitle: 'Mouvement',
        description: 'Decrire position, vitesse et acceleration sans etudier la cause du mouvement.',
        totalSlides: 4,
        slides: [
            {
                title: 'Position',
                theory: 'La position indique ou se trouve un objet par rapport a une origine choisie. Elle depend du repere utilise.',
            },
            {
                title: 'Vitesse',
                theory: 'La vitesse mesure le changement de position par unite de temps. Une vitesse positive ou negative depend du sens choisi.',
                code: 'v = variation de position / variation de temps',
            },
            {
                title: 'Acceleration',
                theory: 'L acceleration mesure le changement de vitesse par unite de temps. Elle peut exister meme si l objet ralentit.',
                code: 'a = variation de vitesse / variation de temps',
            },
            {
                title: 'Mouvement uniforme',
                theory: 'Quand la vitesse est constante, l acceleration est nulle et la position change de facon lineaire.',
            },
        ],
    },
    {
        id: 'forces-basics',
        title: 'Forces',
        subtitle: 'Dynamique',
        description: 'Relier les forces appliquees au changement de mouvement.',
        totalSlides: 3,
        slides: [
            {
                title: 'Idee principale',
                theory: 'Une force peut changer la vitesse, la direction ou la forme d un objet. Elle se mesure en newtons.',
            },
            {
                title: 'Deuxieme loi',
                theory: 'La somme des forces sur un objet determine son acceleration. Plus la masse est grande, plus il faut de force pour obtenir la meme acceleration.',
                code: 'F = m * a',
            },
            {
                title: 'Equilibre',
                theory: 'Si la somme des forces est nulle, l objet garde son etat de mouvement: repos ou vitesse constante.',
            },
        ],
    },
    {
        id: 'energy-basics',
        title: 'Energie',
        subtitle: 'Travail et conservation',
        description: 'Suivre les transformations entre energie cinetique, potentielle et travail.',
        totalSlides: 3,
        slides: [
            {
                title: 'Energie cinetique',
                theory: 'L energie cinetique depend de la masse et de la vitesse. Un objet plus rapide possede beaucoup plus d energie.',
                code: 'Ec = 1/2 * m * v^2',
            },
            {
                title: 'Energie potentielle',
                theory: 'L energie potentielle gravitationnelle depend de la hauteur dans un champ de gravite.',
                code: 'Ep = m * g * h',
            },
            {
                title: 'Conservation',
                theory: 'Quand les frottements sont negligeables, l energie mecanique totale reste constante.',
            },
        ],
    },
];

export const SUBJECT_LABELS: Record<CourseSubject, string> = {
    java: 'Java',
    math: 'Math',
    physique: 'Physique',
};

export const COURSE_SUBJECTS: Record<CourseSubject, LearningCourse[]> = {
    java: COURSES as unknown as LearningCourse[],
    math: mathCourses,
    physique: physicsCourses,
};

const COURSE_PROGRESS_KEY = 'evidex_learning_course_progress';
let memoryProgress: CourseProgressMap = {};

function progressKey(subject: CourseSubject, courseId: string) {
    return `${subject}:${courseId}`;
}

function canUseLocalStorage() {
    return typeof localStorage !== 'undefined';
}

export function getCourseProgressMap(): CourseProgressMap {
    if (!canUseLocalStorage()) {
        return memoryProgress;
    }

    try {
        const savedProgress = localStorage.getItem(COURSE_PROGRESS_KEY);
        return savedProgress ? JSON.parse(savedProgress) : {};
    } catch {
        return {};
    }
}

export function getCourseProgress(subject: CourseSubject, courseId: string) {
    return getCourseProgressMap()[progressKey(subject, courseId)] ?? 0;
}

export function saveCourseProgress(subject: CourseSubject, courseId: string, slideIndex: number) {
    const nextProgress = {
        ...getCourseProgressMap(),
        [progressKey(subject, courseId)]: slideIndex,
    };

    memoryProgress = nextProgress;

    if (canUseLocalStorage()) {
        localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(nextProgress));
    }
}

export function findCourse(subject: CourseSubject, courseId: string) {
    return COURSE_SUBJECTS[subject].find((course) => course.id === courseId);
}
