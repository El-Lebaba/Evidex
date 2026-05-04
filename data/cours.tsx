import { donneesLocales } from '@/db/donnees-principales';

/**
 * CoursLocal DATA STRUCTURE
 *
 * To add a new CoursLocal:
 * 1. Create a new object following the structure below
 * 2. Each CoursLocal has slides[] - each slide has theory + animation config
 * 3. Push it into the COURSES array
 *
 * Animation types:
 * - "gate"       â†’ A sphere approaches a gate (true/false logic)
 * - "loop"       â†’ A carousel of items cycling through
 * - "variable"   â†’ A box that changes its value
 * - "comparison" â†’ Two values being compared
 * - "flow"       â†’ Flowchart-style execution path
 */

export type MatiereCours = 'java' | 'mathematiques' | 'physique';

export type DiapositiveCours = {
    code?: string;
    theory: string;
    title: string;
};
export type QuizCours = {
    answerIndex: number;
    choices: string[];
    question: string;
};
export type CoursApprentissage = {
    description: string;
    id: string;
    slides: DiapositiveCours[];
    subtitle: string;
    title: string;
    totalSlides: number;
};
export type CarteProgressionCours = Record<string, number>;
export type DetailsProgressionCours = {
    completed: boolean;
    exerciseCompleted: boolean;
    highestSlideIndex: number;
    progress: number;
};
export type CoursApprentissageRecent = {
    id: string;
    courseId: string;
    subject: MatiereCours;
    name: string;
    progress: number;
    completed: boolean;
    totalSlides: number;
    highestSlideIndex: number;
    exerciseCompleted: boolean;
};

const mathCourses: CoursApprentissage[] = [
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

const physicsCourses: CoursApprentissage[] = [
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

const javaCourses = [
    {
        id: "variables",
        title: "Variables",
        subtitle: "Types de donnÃ©es",
        icon: "ðŸ“¦",
        color: "from-emerald-500 to-teal-600",
        description: "Comprendre comment Java stocke et gÃ¨re les donnÃ©es en mÃ©moire.",
        totalSlides: 6,
        slides: [
            {
                title: "Qu'est-ce qu'une variable ?",
                theory: "Une **variable** est un conteneur nommÃ© qui stocke une valeur. On peut l'imaginer comme une boÃ®te avec une Ã©tiquette : on lui donne un nom, puis on y place une donnÃ©e.",
                code: `int age = 25;`,
                animation: {
                    type: "variable",
                    varName: "age",
                    varType: "int",
                    value: 25,
                    label: "Une boÃ®te nommÃ©e 'age' contient maintenant la valeur 25."
                }
            },
            {
                title: "DÃ©clarer et assigner une valeur",
                theory: "Pour crÃ©er une variable en Java, on choisit d'abord un **type**, puis un **nom**, puis on peut lui assigner une valeur avec `=`. On peut aussi la dÃ©clarer d'abord, puis lui donner une valeur plus tard.",
                code: `String nom = "Jean";\nint nombre;\nnombre = 15;\nSystem.out.println(nom);\nSystem.out.println(nombre);`,
                animation: {
                    type: "variable",
                    varName: "nombre",
                    varType: "int",
                    value: 15,
                    label: "La variable est dÃ©clarÃ©e, puis reÃ§oit sa valeur plus tard."
                }
            },
            {
                title: "Modifier une variable",
                theory: "Une variable peut Ãªtre **rÃ©assignÃ©e**. L'ancienne valeur est remplacÃ©e par la nouvelle. En Java, cela n'ajoute pas une nouvelle variable : cela met Ã  jour la mÃªme boÃ®te.",
                code: `int age = 25;\nage = 30; // maintenant age vaut 30`,
                animation: {
                    type: "variable",
                    varName: "age",
                    varType: "int",
                    value: 30,
                    previousValue: 25,
                    label: "La boÃ®te 'age' passe de 25 â†’ 30."
                }
            },
            {
                title: "Types courants de variables",
                theory: "Java est un langage **fortement typÃ©** : chaque variable doit avoir un type prÃ©cis. Les types les plus courants sont `int` (entiers), `double` (nombres dÃ©cimaux), `String` (texte), `char` (un seul caractÃ¨re) et `boolean` (vrai/faux).",
                code: `int count = 10;\ndouble price = 9.99;\nString name = "Java";\nchar grade = 'A';\nboolean active = true;`,
                animation: {
                    type: "variable",
                    varName: "name",
                    varType: "String",
                    value: '"Java"',
                    label: "Chaque type reprÃ©sente une catÃ©gorie diffÃ©rente de donnÃ©es."
                }
            },
            {
                title: "Variables finales (`final`)",
                theory: "Le mot-clÃ© `final` rend une variable **constante**. Une fois sa valeur dÃ©finie, elle ne peut plus Ãªtre modifiÃ©e. C'est utile pour des valeurs fixes comme `PI` ou des limites qui ne doivent jamais changer.",
                code: `final double PI = 3.14159;\n// PI = 3.0; // ERREUR`,
                animation: {
                    type: "variable",
                    varName: "PI",
                    varType: "final double",
                    value: 3.14159,
                    locked: true,
                    label: "Cette boÃ®te est verrouillÃ©e : aucune modification n'est autorisÃ©e."
                }
            },
            {
                title: "Le mot-clÃ© `var`",
                theory: "Depuis Java 10, `var` permet au compilateur de **dÃ©duire automatiquement** le type Ã  partir de la valeur assignÃ©e. C'est pratique pour allÃ©ger le code, mais le type reste fixÃ© une fois choisi. `var` doit obligatoirement Ãªtre utilisÃ© avec une valeur dÃ¨s la dÃ©claration.",
                code: `var x = 5;         // int\nvar prix = 9.99;   // double\nvar lettre = 'D';  // char\nvar actif = true;  // boolean\nvar texte = "Bonjour"; // String\n\n// var y; // ERREUR`,
                animation: {
                    type: "comparison",
                    left: { label: "var x = 5", value: "int" },
                    right: { label: 'var texte = "Bonjour"', value: "String" },
                    label: "Le compilateur choisit le type automatiquement selon la valeur."
                }
            }
        ]
    },
    {
        id: "data-types",
        title: "Types de donnÃ©es",
        subtitle: "Primitifs et non primitifs",
        icon: "ðŸ§©",
        color: "from-green-500 to-emerald-600",
        description: "Comprendre les diffÃ©rents types de donnÃ©es en Java.",
        totalSlides: 5,
        slides: [
            {
                title: "Les grandes familles de types",
                theory: "En Java, les types de donnÃ©es se divisent en deux groupes : les **types primitifs** et les **types non primitifs**. Les primitifs stockent directement une valeur simple. Les non primitifs, comme `String`, les tableaux et les classes, reprÃ©sentent des objets ou des structures plus complexes.",
                code: `int myNum = 5;\nfloat myFloatNum = 5.99f;\nchar myLetter = 'D';\nboolean myBool = true;\nString myText = "Hello";`,
                animation: {
                    type: "comparison",
                    left: { label: "Primitifs", value: "int, double, char, boolean..." },
                    right: { label: "Non primitifs", value: "String, tableaux, classes..." },
                    label: "Deux grandes familles de types en Java."
                }
            },
            {
                title: "Les 8 types primitifs",
                theory: "Java possÃ¨de **huit types primitifs** : `byte`, `short`, `int`, `long`, `float`, `double`, `boolean` et `char`. Ils servent Ã  reprÃ©senter des nombres, des caractÃ¨res et des valeurs logiques.",
                code: `byte b = 100;\nshort s = 5000;\nint i = 100000;\nlong l = 15000000000L;\nfloat f = 5.75f;\ndouble d = 19.99d;\nboolean ok = true;\nchar c = 'A';`,
                animation: {
                    type: "variable",
                    varName: "i",
                    varType: "int",
                    value: 100000,
                    label: "Chaque type primitif a un rÃ´le et une capacitÃ© de stockage diffÃ©rente."
                }
            },
            {
                title: "Entiers et nombres dÃ©cimaux",
                theory: "Les types entiers (`byte`, `short`, `int`, `long`) servent Ã  stocker des nombres sans dÃ©cimales. Les types Ã  virgule (`float`, `double`) servent pour les nombres dÃ©cimaux. En pratique, `int` est souvent le choix par dÃ©faut pour les entiers et `double` pour les calculs dÃ©cimaux, car il offre une meilleure prÃ©cision que `float`.",
                code: `int age = 25;\ndouble price = 19.99;\nfloat note = 5.75f;\nlong population = 8000000000L;`,
                animation: {
                    type: "comparison",
                    left: { label: "int", value: "nombres entiers" },
                    right: { label: "double", value: "nombres dÃ©cimaux" },
                    label: "Choisir le bon type dÃ©pend de la nature de la donnÃ©e."
                }
            },
            {
                title: "Le type `char` et le type `boolean`",
                theory: "Le type `char` stocke **un seul caractÃ¨re** entre apostrophes, comme `'A'`. Le type `boolean` stocke uniquement `true` ou `false`. Ces deux types sont trÃ¨s utilisÃ©s dans les conditions et la logique de programme.",
                code: `char grade = 'B';\nboolean isJavaFun = true;\n\nSystem.out.println(grade);\nSystem.out.println(isJavaFun);`,
                animation: {
                    type: "comparison",
                    left: { label: "char", value: "'B'" },
                    right: { label: "boolean", value: "true" },
                    label: "Un caractÃ¨re d'un cÃ´tÃ©, une valeur logique de l'autre."
                }
            },
            {
                title: "Un type ne change pas tout seul",
                theory: "Une fois qu'une variable est dÃ©clarÃ©e avec un type, elle **ne peut pas devenir un autre type** plus tard. Cette rÃ¨gle rend Java plus sÃ»r, car le compilateur empÃªche les mÃ©langes incorrects. Pour convertir un type en un autre, il faut utiliser le transtypage.",
                code: `int myNum = 5;\n// myNum = "Bonjour"; // ERREUR\n\nString myText = "Salut";\n// myText = 123; // ERREUR`,
                animation: {
                    type: "gate",
                    value: '"Bonjour"',
                    condition: "assigner un String Ã  un int",
                    result: false,
                    label: "Java bloque les assignations incompatibles."
                }
            }
        ]
    },
    {
        id: "type-casting",
        title: "Transtypage",
        subtitle: "Conversion de types",
        icon: "ðŸ”",
        color: "from-teal-500 to-cyan-600",
        description: "Convertir une valeur d'un type Ã  un autre en Java.",
        totalSlides: 4,
        slides: [
            {
                title: "Qu'est-ce que le transtypage ?",
                theory: "Le **transtypage** consiste Ã  convertir une donnÃ©e d'un type vers un autre. Par exemple, transformer un `int` en `double` ou un `double` en `int`.",
                code: `int myInt = 9;\ndouble myDouble = myInt;`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "int 9", result: true },
                        { label: "conversion", result: true },
                        { label: "double 9.0", result: true, output: "9.0" }
                    ],
                    label: "Une valeur peut Ãªtre convertie d'un type Ã  un autre."
                }
            },
            {
                title: "Conversion Ã©largissante (automatique)",
                theory: "La conversion **Ã©largissante** transforme un type plus petit vers un type plus grand, par exemple `int` vers `double`. Elle est automatique, car il n'y a gÃ©nÃ©ralement pas de perte d'information.",
                code: `int myInt = 9;\ndouble myDouble = myInt; // conversion automatique\n\nSystem.out.println(myInt);    // 9\nSystem.out.println(myDouble); // 9.0`,
                animation: {
                    type: "comparison",
                    left: { label: "int", value: "9" },
                    right: { label: "double", value: "9.0" },
                    label: "Le passage vers un type plus large se fait automatiquement."
                }
            },
            {
                title: "Conversion rÃ©ductrice (manuelle)",
                theory: "La conversion **rÃ©ductrice** transforme un type plus grand vers un type plus petit, par exemple `double` vers `int`. Elle doit Ãªtre faite manuellement avec des parenthÃ¨ses, car elle peut provoquer une **perte d'information**, comme la suppression des dÃ©cimales.",
                code: `double myDouble = 9.78d;\nint myInt = (int) myDouble;\n\nSystem.out.println(myDouble); // 9.78\nSystem.out.println(myInt);    // 9`,
                animation: {
                    type: "variable",
                    varName: "myInt",
                    varType: "int",
                    value: 9,
                    previousValue: 9.78,
                    label: "Le transtypage vers `int` retire la partie dÃ©cimale."
                }
            },
            {
                title: "Exemple concret : calculer un pourcentage",
                theory: "Le transtypage est trÃ¨s utile dans les calculs. Si on divise deux `int`, le rÃ©sultat reste entier. En convertissant l'un des deux en `double`, on obtient un rÃ©sultat dÃ©cimal plus prÃ©cis.",
                code: `int maxScore = 500;\nint userScore = 423;\n\ndouble percentage = (double) userScore / maxScore * 100.0d;\nSystem.out.println("Pourcentage : " + percentage);`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "423 / 500", result: true },
                        { label: "cast vers double", result: true },
                        { label: "84.6", result: true, output: "84.6" }
                    ],
                    label: "Le cast en `double` permet un calcul prÃ©cis."
                }
            }
        ]
    },
    {
        id: "strings",
        title: "Strings",
        subtitle: "Manipulation de texte",
        icon: "ðŸ’¬",
        color: "from-sky-500 to-blue-600",
        description: "Travailler avec le texte en Java.",
        totalSlides: 5,
        slides: [
            {
                title: "CrÃ©er une String",
                theory: "Une `String` est une suite de caractÃ¨res entourÃ©e de guillemets doubles. En Java, `String` est un **type non primitif** : c'est un objet, pas un type primitif.",
                code: `String greeting = "Hello, World!";\nSystem.out.println(greeting);`,
                animation: {
                    type: "variable",
                    varName: "greeting",
                    varType: "String",
                    value: '"Hello, World!"',
                    label: "Une variable String contenant du texte."
                }
            },
            {
                title: "Longueur et accÃ¨s aux caractÃ¨res",
                theory: "Les chaÃ®nes ont des mÃ©thodes utiles. `.length()` donne le nombre de caractÃ¨res. `.charAt(index)` permet d'accÃ©der Ã  un caractÃ¨re prÃ©cis. Les index commencent toujours Ã  **0**.",
                code: `String txt = "Hello";\nSystem.out.println(txt.length());   // 5\nSystem.out.println(txt.charAt(0)); // H\nSystem.out.println(txt.charAt(4)); // o`,
                animation: {
                    type: "comparison",
                    left: { label: "index 0", value: '"H"' },
                    right: { label: "index 4", value: '"o"' },
                    label: "Les positions dans une String commencent Ã  0."
                }
            },
            {
                title: "MÃ©thodes utiles sur les Strings",
                theory: "Les Strings possÃ¨dent de nombreuses mÃ©thodes. Par exemple, `.toUpperCase()` met tout en majuscules, `.toLowerCase()` met en minuscules, `.trim()` enlÃ¨ve les espaces au dÃ©but et Ã  la fin, et `.indexOf()` trouve la position d'un texte dans la chaÃ®ne.",
                code: `String txt = "   Hello World   ";\nSystem.out.println(txt.toUpperCase());\nSystem.out.println(txt.toLowerCase());\nSystem.out.println(txt.trim());\nSystem.out.println("Please locate where 'locate' occurs!".indexOf("locate"));`,
                animation: {
                    type: "comparison",
                    left: { label: ".toUpperCase()", value: '"HELLO WORLD"' },
                    right: { label: ".trim()", value: '"Hello World"' },
                    label: "Les mÃ©thodes transforment ou analysent le texte."
                }
            },
            {
                title: "ConcatÃ©nation de chaÃ®nes",
                theory: "On peut utiliser l'opÃ©rateur `+` pour **assembler** plusieurs chaÃ®nes. On peut aussi combiner du texte avec des nombres : Java convertit automatiquement les autres types en texte quand on concatÃ¨ne avec une `String`.",
                code: `String first = "Bonjour";\nString second = "Monde";\nString full = first + " " + second;\n\nint age = 25;\nString msg = "Ã‚ge : " + age;\n\nSystem.out.println(full);\nSystem.out.println(msg);`,
                animation: {
                    type: "variable",
                    varName: "full",
                    varType: "String",
                    value: '"Bonjour Monde"',
                    label: "Deux chaÃ®nes sont fusionnÃ©es en une seule."
                }
            },
            {
                title: "Comparer des Strings",
                theory: "Pour comparer deux chaÃ®nes, on utilise `.equals()` et non `==`. La mÃ©thode `equals()` compare le **contenu** du texte. C'est la maniÃ¨re correcte de vÃ©rifier si deux Strings reprÃ©sentent la mÃªme chose.",
                code: `String txt1 = "Hello";\nString txt2 = "Hello";\nString txt3 = "Salut";\n\nSystem.out.println(txt1.equals(txt2)); // true\nSystem.out.println(txt1.equals(txt3)); // false`,
                animation: {
                    type: "comparison",
                    left: { label: '"Hello".equals("Hello")', value: "true" },
                    right: { label: '"Hello".equals("Salut")', value: "false" },
                    label: "On compare le contenu, pas seulement la rÃ©fÃ©rence."
                }
            }
        ]
    },
    {
        id: "operators",
        title: "OpÃ©rateurs",
        subtitle: "Calculs et comparaisons",
        icon: "Ã¢Å¾â€¢",
        color: "from-yellow-500 to-amber-600",
        description: "Utiliser les opÃ©rateurs Java pour calculer, comparer et construire des expressions.",
        totalSlides: 4,
        slides: [
            {
                title: "Les opÃ©rateurs arithmÃ©tiques",
                theory: "Les opÃ©rateurs servent Ã  effectuer des actions sur des valeurs ou des variables. Les plus courants sont `+`, `-`, `*`, `/` et `%`. Ils permettent d'additionner, soustraire, multiplier, diviser ou obtenir le reste d'une division.",
                code: `int a = 10;\nint b = 3;\n\nSystem.out.println(a + b); // 13\nSystem.out.println(a - b); // 7\nSystem.out.println(a * b); // 30\nSystem.out.println(a / b); // 3\nSystem.out.println(a % b); // 1`,
                animation: {
                    type: "comparison",
                    left: { label: "a + b", value: "13" },
                    right: { label: "a % b", value: "1" },
                    label: "Les opÃ©rateurs arithmÃ©tiques rÃ©alisent des calculs de base."
                }
            },
            {
                title: "L'opÃ©rateur `+` avec des variables",
                theory: "L'opÃ©rateur `+` peut additionner deux valeurs, une variable et une valeur, ou deux variables. Il est trÃ¨s utilisÃ© dans les expressions numÃ©riques, mais aussi dans la concatÃ©nation de chaÃ®nes.",
                code: `int sum1 = 100 + 50;\nint sum2 = sum1 + 250;\nint sum3 = sum2 + sum2;\n\nSystem.out.println(sum1);\nSystem.out.println(sum2);\nSystem.out.println(sum3);`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "100 + 50", result: true, output: "150" },
                        { label: "150 + 250", result: true, output: "400" },
                        { label: "400 + 400", result: true, output: "800" }
                    ],
                    label: "Une expression peut rÃ©utiliser le rÃ©sultat prÃ©cÃ©dent."
                }
            },
            {
                title: "OpÃ©rateurs de comparaison",
                theory: "Les opÃ©rateurs de comparaison servent Ã  produire des rÃ©sultats `true` ou `false`. On utilise notamment `<`, `<=`, `>`, `>=`, `==` et `!=`. Ils sont indispensables dans les conditions.",
                code: `int x = 20;\nint y = 18;\n\nSystem.out.println(x > y);  // true\nSystem.out.println(x == y); // false\nSystem.out.println(x != y); // true`,
                animation: {
                    type: "comparison",
                    left: { label: "x > y", value: "true" },
                    right: { label: "x == y", value: "false" },
                    label: "Les comparaisons produisent toujours un boolÃ©en."
                }
            },
            {
                title: "OpÃ©rateurs logiques",
                theory: "Les opÃ©rateurs logiques permettent de combiner plusieurs conditions. `&&` signifie ET, `||` signifie OU, et `!` signifie NON. Ils sont trÃ¨s utiles dans les structures conditionnelles.",
                code: `int age = 25;\nboolean hasID = true;\nboolean isHoliday = false;\n\nSystem.out.println(age >= 18 && hasID); // true\nSystem.out.println(isHoliday || hasID);  // true\nSystem.out.println(!isHoliday);          // true`,
                animation: {
                    type: "comparison",
                    left: { label: "age >= 18 && hasID", value: "true" },
                    right: { label: "!isHoliday", value: "true" },
                    label: "Les opÃ©rateurs logiques combinent des conditions."
                }
            }
        ]
    },
    {
        id: "mathematiques",
        title: "Math",
        subtitle: "Calculs mathÃ©matiques",
        icon: "ðŸ§®",
        color: "from-orange-500 to-red-600",
        description: "Utiliser la classe Math pour effectuer des calculs utiles.",
        totalSlides: 4,
        slides: [
            {
                title: "Valeurs max, min et absolues",
                theory: "La classe `Math` propose plusieurs mÃ©thodes pratiques. `Math.max(x, y)` renvoie la plus grande valeur, `Math.min(x, y)` la plus petite, et `Math.abs(x)` la valeur absolue.",
                code: `System.out.println(Math.max(5, 10)); // 10\nSystem.out.println(Math.min(5, 10)); // 5\nSystem.out.println(Math.abs(-4.7));  // 4.7`,
                animation: {
                    type: "comparison",
                    left: { label: "Math.max(5, 10)", value: "10" },
                    right: { label: "Math.abs(-4.7)", value: "4.7" },
                    label: "La classe Math fournit des outils prÃªts Ã  l'emploi."
                }
            },
            {
                title: "Racines et puissances",
                theory: "`Math.sqrt(x)` calcule la racine carrÃ©e, et `Math.pow(x, y)` Ã©lÃ¨ve `x` Ã  la puissance `y`. Il faut noter que `Math.pow()` retourne toujours un `double`, mÃªme si le rÃ©sultat semble entier.",
                code: `System.out.println(Math.sqrt(64));   // 8.0\nSystem.out.println(Math.pow(2, 8)); // 256.0`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "sqrt(64)", result: true, output: "8.0" },
                        { label: "pow(2, 8)", result: true, output: "256.0" }
                    ],
                    label: "Certaines mÃ©thodes retournent toujours un double."
                }
            },
            {
                title: "Arrondir des nombres",
                theory: "Java propose plusieurs mÃ©thodes pour l'arrondi. `Math.round(x)` arrondit Ã  l'entier le plus proche. `Math.ceil(x)` arrondit vers le haut. `Math.floor(x)` arrondit vers le bas.",
                code: `System.out.println(Math.round(4.6)); // 5\nSystem.out.println(Math.ceil(4.1));  // 5.0\nSystem.out.println(Math.floor(4.9)); // 4.0`,
                animation: {
                    type: "comparison",
                    left: { label: "Math.ceil(4.1)", value: "5.0" },
                    right: { label: "Math.floor(4.9)", value: "4.0" },
                    label: "Chaque mÃ©thode suit une rÃ¨gle d'arrondi diffÃ©rente."
                }
            },
            {
                title: "Nombres alÃ©atoires",
                theory: "`Math.random()` renvoie un nombre alÃ©atoire entre `0.0` inclus et `1.0` exclu. Pour obtenir un entier dans une plage prÃ©cise, on combine `Math.random()` avec une multiplication et un cast.",
                code: `double randomValue = Math.random();\nint randomNum = (int)(Math.random() * 101); // 0 Ã  100\n\nSystem.out.println(randomValue);\nSystem.out.println(randomNum);`,
                animation: {
                    type: "variable",
                    varName: "randomNum",
                    varType: "int",
                    value: 42,
                    label: "AprÃ¨s multiplication et cast, on obtient un entier dans l'intervalle voulu."
                }
            }
        ]
    },
    {
        id: "if-statement",
        title: "Le if",
        subtitle: "Logique conditionnelle",
        icon: "ðŸš¦",
        color: "from-indigo-500 to-violet-600",
        description: "Apprendre comment Java dÃ©cide quel code exÃ©cuter selon une condition.",
        totalSlides: 5,
        slides: [
            {
                title: "Qu'est-ce qu'un if ?",
                theory: "Une instruction **if** permet au programme de prendre une dÃ©cision. Elle vÃ©rifie une condition. Si la condition vaut `true`, le bloc est exÃ©cutÃ©. Si elle vaut `false`, il est ignorÃ©.",
                code: `if (condition) {\n  // s'exÃ©cute seulement si la condition est vraie\n}`,
                animation: {
                    type: "gate",
                    value: 50,
                    condition: "value > 100",
                    result: false,
                    label: "La sphÃ¨re vaut 50 â€” la porte exige > 100. AccÃ¨s refusÃ©."
                }
            },
            {
                title: "Conditions avec comparaisons",
                theory: "Les conditions d'un `if` utilisent souvent des opÃ©rateurs de comparaison comme `<`, `>`, `==` ou `!=`. Le rÃ©sultat doit toujours Ãªtre un boolÃ©en.",
                code: `int x = 20;\nint y = 18;\n\nif (x > y) {\n  System.out.println("x est plus grand que y");\n}`,
                animation: {
                    type: "gate",
                    value: "20 > 18",
                    condition: "x > y",
                    result: true,
                    label: "La condition est vraie, donc le bloc s'exÃ©cute."
                }
            },
            {
                title: "Tester directement un boolÃ©en",
                theory: "On peut aussi utiliser directement une variable boolÃ©enne dans un `if`. Ã‰crire `if (isLightOn)` est plus clair que `if (isLightOn == true)`.",
                code: `boolean isLightOn = true;\n\nif (isLightOn) {\n  System.out.println("La lumiÃ¨re est allumÃ©e.");\n}`,
                animation: {
                    type: "gate",
                    value: "true",
                    condition: "isLightOn",
                    result: true,
                    label: "Un boolÃ©en peut Ãªtre utilisÃ© directement comme condition."
                }
            },
            {
                title: "Le bloc else",
                theory: "Quand la condition du `if` est fausse, on peut utiliser `else` pour exÃ©cuter un autre bloc. `else` agit comme la solution de rechange.",
                code: `int value = 30;\nif (value > 100) {\n  System.out.println("Grand !");\n} else {\n  System.out.println("Petit !");\n}`,
                animation: {
                    type: "gate",
                    value: 30,
                    condition: "value > 100",
                    result: false,
                    label: "La condition Ã©choue, donc le chemin `else` est utilisÃ©."
                }
            },
            {
                title: "Toujours utiliser les accolades",
                theory: "MÃªme si Java permet parfois d'Ã©crire un `if` sans accolades pour une seule ligne, il est bien plus sÃ»r de **toujours** utiliser `{ }`. Sans accolades, seule la premiÃ¨re ligne appartient au `if`, ce qui peut crÃ©er des bugs subtils.",
                code: `int x = 20;\nint y = 18;\n\nif (x > y) {\n  System.out.println("x est plus grand que y");\n  System.out.println("Ces deux lignes font partie du if");\n}\n\nSystem.out.println("Cette ligne est en dehors du if");`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "condition vraie", result: true },
                        { label: "bloc entre accolades", result: true },
                        { label: "code extÃ©rieur", result: true }
                    ],
                    label: "Les accolades rendent le comportement du code clair et sÃ»r."
                }
            }
        ]
    },
    {
        id: "else-if",
        title: "Else If",
        subtitle: "Conditions multiples",
        icon: "ðŸªœ",
        color: "from-purple-500 to-indigo-600",
        description: "Tester plusieurs possibilitÃ©s dans l'ordre.",
        totalSlides: 3,
        slides: [
            {
                title: "Le `else if`",
                theory: "L'instruction `else if` permet de tester une nouvelle condition si la premiÃ¨re condition du `if` est fausse. Java vÃ©rifie les conditions dans l'ordre et exÃ©cute **le premier bloc vrai**.",
                code: `int score = 75;\nif (score >= 90) {\n  System.out.println("A");\n} else if (score >= 70) {\n  System.out.println("B");\n} else {\n  System.out.println("C");\n}`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "score >= 90", result: false },
                        { label: "score >= 70", result: true, output: "B" },
                        { label: "else", result: false }
                    ],
                    label: "Java s'arrÃªte dÃ¨s qu'une condition est vraie."
                }
            },
            {
                title: "Exemple avec le temps",
                theory: "On peut enchaÃ®ner plusieurs conditions pour afficher des rÃ©sultats diffÃ©rents selon la situation. Ici, le message dÃ©pend de l'heure de la journÃ©e.",
                code: `int time = 16;\n\nif (time < 12) {\n  System.out.println("Bonjour.");\n} else if (time < 18) {\n  System.out.println("Bonne journÃ©e.");\n} else {\n  System.out.println("Bonsoir.");\n}`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "time < 12", result: false },
                        { label: "time < 18", result: true, output: "Bonne journÃ©e." },
                        { label: "else", result: false }
                    ],
                    label: "La deuxiÃ¨me condition gagne ici."
                }
            },
            {
                title: "Ordre des conditions",
                theory: "L'ordre des `if` et `else if` est important. Java teste de haut en bas. Si une condition large est placÃ©e trop tÃ´t, elle peut empÃªcher les suivantes d'Ãªtre atteintes.",
                code: `int score = 95;\n\nif (score >= 70) {\n  System.out.println("RÃ©ussi");\n} else if (score >= 90) {\n  System.out.println("Excellent");\n}\n// "Excellent" ne sera jamais affichÃ© ici`,
                animation: {
                    type: "gate",
                    value: 95,
                    condition: "score >= 70 en premier",
                    result: true,
                    label: "Une condition trop gÃ©nÃ©rale placÃ©e en premier peut masquer les autres."
                }
            }
        ]
    },
    {
        id: "switch",
        title: "Switch",
        subtitle: "Choix parmi plusieurs cas",
        icon: "ðŸ”€",
        color: "from-lime-500 to-green-600",
        description: "Choisir proprement entre plusieurs possibilitÃ©s avec switch.",
        totalSlides: 3,
        slides: [
            {
                title: "L'instruction switch",
                theory: "Une instruction `switch` compare une expression Ã  plusieurs **cas** possibles. C'est souvent plus lisible qu'une longue suite de `if / else if` lorsqu'on veut tester plusieurs valeurs prÃ©cises.",
                code: `int day = 3;\nswitch (day) {\n  case 1: System.out.println("Lundi"); break;\n  case 2: System.out.println("Mardi"); break;\n  case 3: System.out.println("Mercredi"); break;\n  default: System.out.println("Autre");\n}`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "case 1 (Lundi)", result: false },
                        { label: "case 2 (Mardi)", result: false },
                        { label: "case 3 (Mercredi)", result: true, output: "Mercredi" },
                        { label: "default", result: false }
                    ],
                    label: "day = 3 â†’ correspond au case 3 â†’ affiche Mercredi."
                }
            },
            {
                title: "Le mot-clÃ© `break`",
                theory: "Le mot-clÃ© `break` arrÃªte l'exÃ©cution du `switch` aprÃ¨s le cas trouvÃ©. Sans `break`, Java continue dans les cas suivants : c'est ce qu'on appelle le **fall-through**. C'est parfois voulu, mais le plus souvent c'est une erreur.",
                code: `int x = 1;\nswitch (x) {\n  case 1:\n    System.out.println("A");\n  case 2:\n    System.out.println("B");\n    break;\n}\n// Affiche A puis B`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "case 1 â†’ affiche A", result: true, output: "A" },
                        { label: "tombe dans case 2 â†’ affiche B", result: true, output: "B" }
                    ],
                    label: "Sans `break`, l'exÃ©cution continue dans les cas suivants."
                }
            },
            {
                title: "Le cas `default`",
                theory: "Le bloc `default` s'exÃ©cute si **aucun** des autres cas ne correspond. C'est l'Ã©quivalent d'un `else` dans un `switch`.",
                code: `int day = 9;\nswitch (day) {\n  case 1: System.out.println("Lundi"); break;\n  case 2: System.out.println("Mardi"); break;\n  default: System.out.println("Inconnu");\n}`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "case 1", result: false },
                        { label: "case 2", result: false },
                        { label: "default", result: true, output: "Inconnu" }
                    ],
                    label: "Aucun cas ne correspond â†’ `default` s'exÃ©cute."
                }
            }
        ]
    },
    {
        id: "while-loop",
        title: "Boucles while",
        subtitle: "RÃ©pÃ©tition conditionnelle",
        icon: "â³",
        color: "from-rose-500 to-pink-600",
        description: "ExÃ©cuter du code tant qu'une condition reste vraie.",
        totalSlides: 4,
        slides: [
            {
                title: "La boucle while",
                theory: "Une boucle `while` rÃ©pÃ¨te un bloc de code **tant que** sa condition est vraie. Elle est utile quand on ne sait pas exactement combien de fois le code devra se rÃ©pÃ©ter.",
                code: `int count = 0;\nwhile (count < 3) {\n  System.out.println(count);\n  count++;\n}`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 3,
                    items: [0, 1, 2],
                    label: "La boucle continue tant que `count < 3`."
                }
            },
            {
                title: "Ne pas oublier la mise Ã  jour",
                theory: "Si la variable utilisÃ©e dans la condition n'est jamais modifiÃ©e, la condition peut rester vraie indÃ©finiment. C'est ainsi qu'on crÃ©e une **boucle infinie** par erreur.",
                code: `// ATTENTION\nwhile (true) {\n  System.out.println("Toujours...");\n}`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 999,
                    items: ["â™¾ï¸", "â™¾ï¸", "â™¾ï¸", "â™¾ï¸", "â™¾ï¸"],
                    label: "Si la condition ne devient jamais fausse, la boucle ne s'arrÃªte pas."
                }
            },
            {
                title: "Condition fausse dÃ¨s le dÃ©part",
                theory: "Si la condition d'une boucle `while` est fausse dÃ¨s le dÃ©but, le bloc de code **ne s'exÃ©cute jamais**. C'est une diffÃ©rence importante avec `do / while`.",
                code: `int i = 10;\n\nwhile (i < 5) {\n  System.out.println("Ceci ne sera jamais affichÃ©");\n  i++;\n}`,
                animation: {
                    type: "gate",
                    value: 10,
                    condition: "i < 5",
                    result: false,
                    label: "La boucle est ignorÃ©e dÃ¨s le dÃ©part."
                }
            },
            {
                title: "La boucle do / while",
                theory: "La boucle `do / while` exÃ©cute le bloc **au moins une fois**, puis vÃ©rifie la condition. MÃªme si la condition est fausse au dÃ©part, le code s'exÃ©cute une premiÃ¨re fois.",
                code: `int i = 10;\n\ndo {\n  System.out.println("i vaut " + i);\n  i++;\n} while (i < 5);`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 1,
                    items: [10],
                    label: "Le bloc s'exÃ©cute une fois avant la vÃ©rification."
                }
            }
        ]
    },
    {
        id: "for-loop",
        title: "Boucles for",
        subtitle: "ItÃ©ration contrÃ´lÃ©e",
        icon: "ðŸ”„",
        color: "from-amber-500 to-orange-600",
        description: "RÃ©pÃ©ter du code un nombre prÃ©cis de fois avec for.",
        totalSlides: 5,
        slides: [
            {
                title: "La structure d'une boucle for",
                theory: "Une boucle `for` est idÃ©ale quand on sait **combien de fois** on veut rÃ©pÃ©ter un bloc. Elle contient trois parties : l'initialisation, la condition et la mise Ã  jour.",
                code: `for (int i = 0; i < 5; i++) {\n  System.out.println(i);\n}`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 5,
                    items: [0, 1, 2, 3, 4],
                    label: "La boucle s'exÃ©cute 5 fois : `i` va de 0 Ã  4."
                }
            },
            {
                title: "Comprendre les trois parties",
                theory: "`int i = 0` s'exÃ©cute une seule fois au dÃ©but. `i < 5` est vÃ©rifiÃ© avant chaque tour. `i++` s'exÃ©cute aprÃ¨s chaque itÃ©ration. Ce schÃ©ma rend la boucle trÃ¨s compacte et lisible.",
                code: `for (int i = 0; i < 5; i++) {\n  System.out.println(i);\n}`,
                animation: {
                    type: "loop",
                    current: 3,
                    max: 5,
                    items: [0, 1, 2, 3, 4],
                    highlightIndex: 3,
                    label: "Ici, on est Ã  l'itÃ©ration oÃ¹ `i = 3`."
                }
            },
            {
                title: "Pas personnalisÃ©",
                theory: "On peut changer la maniÃ¨re dont la variable Ã©volue. Par exemple, avec `i += 2`, la boucle avance de 2 en 2 au lieu de 1 en 1.",
                code: `for (int i = 0; i <= 10; i += 2) {\n  System.out.println(i);\n}\n// 0, 2, 4, 6, 8, 10`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 10,
                    items: [0, 2, 4, 6, 8, 10],
                    label: "La boucle saute un nombre sur deux."
                }
            },
            {
                title: "Boucles imbriquÃ©es",
                theory: "On peut placer une boucle dans une autre. La boucle intÃ©rieure s'exÃ©cute entiÃ¨rement Ã  chaque tour de la boucle extÃ©rieure.",
                code: `for (int i = 0; i < 3; i++) {\n  for (int j = 0; j < 2; j++) {\n    System.out.println(i + "," + j);\n  }\n}`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 6,
                    items: ["0,0", "0,1", "1,0", "1,1", "2,0", "2,1"],
                    label: "3 tours extÃ©rieurs Ã— 2 tours intÃ©rieurs = 6 itÃ©rations."
                }
            },
            {
                title: "La boucle for-each",
                theory: "La boucle **for-each** sert Ã  parcourir directement tous les Ã©lÃ©ments d'un tableau ou d'une collection. Elle est plus simple qu'une boucle `for` classique lorsqu'on n'a pas besoin de l'index.",
                code: `String[] cars = {"Volvo", "BMW", "Ford", "Mazda"};\n\nfor (String car : cars) {\n  System.out.println(car);\n}`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 4,
                    items: ["Volvo", "BMW", "Ford", "Mazda"],
                    label: "La boucle visite chaque Ã©lÃ©ment du tableau, un par un."
                }
            }
        ]
    },
    {
        id: "arrays",
        title: "Tableaux",
        subtitle: "Collections de donnÃ©es",
        icon: "ðŸ“Š",
        color: "from-violet-500 to-purple-600",
        description: "Stocker plusieurs valeurs dans une seule variable.",
        totalSlides: 4,
        slides: [
            {
                title: "CrÃ©er un tableau",
                theory: "Un **tableau** stocke plusieurs valeurs du mÃªme type. Chaque Ã©lÃ©ment possÃ¨de un **index** qui commence Ã  0. Les tableaux sont trÃ¨s utiles pour regrouper plusieurs donnÃ©es liÃ©es.",
                code: `int[] numbers = {10, 20, 30, 40, 50};\n\nSystem.out.println(numbers[0]); // 10\nSystem.out.println(numbers[2]); // 30`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 5,
                    items: [10, 20, 30, 40, 50],
                    label: "5 cases numÃ©rotÃ©es de 0 Ã  4."
                }
            },
            {
                title: "Modifier un Ã©lÃ©ment",
                theory: "On peut modifier une valeur prÃ©cise d'un tableau en utilisant son index. Le tableau reste le mÃªme, mais une de ses cases reÃ§oit une nouvelle valeur.",
                code: `int[] numbers = {10, 20, 30};\nnumbers[1] = 99;\n// Devient {10, 99, 30}`,
                animation: {
                    type: "variable",
                    varName: "numbers[1]",
                    varType: "int",
                    value: 99,
                    previousValue: 20,
                    label: "L'Ã©lÃ©ment Ã  l'index 1 change de 20 â†’ 99."
                }
            },
            {
                title: "La longueur d'un tableau",
                theory: "La propriÃ©tÃ© `.length` indique combien d'Ã©lÃ©ments un tableau contient. Elle est souvent utilisÃ©e dans les boucles pour Ã©viter de dÃ©passer la taille du tableau.",
                code: `String[] cars = {"Volvo", "BMW", "Ford", "Mazda"};\nSystem.out.println(cars.length); // 4`,
                animation: {
                    type: "variable",
                    varName: "cars.length",
                    varType: "int",
                    value: 4,
                    label: "Le tableau contient exactement 4 Ã©lÃ©ments."
                }
            },
            {
                title: "CrÃ©er un tableau avec `new`",
                theory: "On peut aussi crÃ©er un tableau vide avec `new`, en prÃ©cisant sa taille, puis remplir ses cases plus tard. Si les valeurs sont dÃ©jÃ  connues, la syntaxe raccourcie est gÃ©nÃ©ralement plus simple.",
                code: `String[] cars = new String[4];\ncars[0] = "Volvo";\ncars[1] = "BMW";\ncars[2] = "Ford";\ncars[3] = "Mazda";\n\nfor (String car : cars) {\n  System.out.println(car);\n}`,
                animation: {
                    type: "loop",
                    current: 0,
                    max: 4,
                    items: ["Volvo", "BMW", "Ford", "Mazda"],
                    label: "On rÃ©serve 4 cases, puis on les remplit ensuite."
                }
            }
        ]
    },
    {
        id: "methods",
        title: "MÃ©thodes",
        subtitle: "Code rÃ©utilisable",
        icon: "Ã¢Å¡Â¡",
        color: "from-cyan-500 to-blue-600",
        description: "Ã‰crire du code une fois et le rÃ©utiliser avec des mÃ©thodes.",
        totalSlides: 5,
        slides: [
            {
                title: "Qu'est-ce qu'une mÃ©thode ?",
                theory: "Une **mÃ©thode** est un bloc de code avec un nom. Au lieu de rÃ©pÃ©ter le mÃªme code plusieurs fois, on le place dans une mÃ©thode et on l'appelle quand on en a besoin.",
                code: `public class Main {\n  static void myMethod() {\n    System.out.println("Je viens d'Ãªtre exÃ©cutÃ©e !");\n  }\n}`,
                animation: {
                    type: "variable",
                    varName: "myMethod",
                    varType: "method",
                    value: "{ ... }",
                    label: "Une mÃ©thode encapsule un comportement rÃ©utilisable."
                }
            },
            {
                title: "Appeler une mÃ©thode",
                theory: "Pour exÃ©cuter une mÃ©thode, on Ã©crit son nom suivi de parenthÃ¨ses. Une mÃ©thode peut Ãªtre appelÃ©e une seule fois ou plusieurs fois selon le besoin.",
                code: `public class Main {\n  static void myMethod() {\n    System.out.println("Je viens d'Ãªtre exÃ©cutÃ©e !");\n  }\n\n  public static void main(String[] args) {\n    myMethod();\n    myMethod();\n  }\n}`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: "main()", result: true },
                        { label: "â†’ myMethod()", result: true, output: "Je viens d'Ãªtre exÃ©cutÃ©e !" },
                        { label: "â†’ myMethod()", result: true, output: "Je viens d'Ãªtre exÃ©cutÃ©e !" }
                    ],
                    label: "Une mÃªme mÃ©thode peut Ãªtre rÃ©utilisÃ©e plusieurs fois."
                }
            },
            {
                title: "ParamÃ¨tres",
                theory: "Une mÃ©thode peut recevoir des **paramÃ¨tres**. Ce sont des valeurs qu'on lui transmet au moment de l'appel. Cela rend la mÃ©thode plus flexible, car elle peut agir diffÃ©remment selon les donnÃ©es reÃ§ues.",
                code: `public static void greet(String name) {\n  System.out.println("Bonjour " + name);\n}\n\ngreet("Alice");\ngreet("Bob");`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: 'greet("Alice")', result: true, output: "Bonjour Alice" },
                        { label: 'greet("Bob")', result: true, output: "Bonjour Bob" }
                    ],
                    label: "La mÃªme mÃ©thode produit un rÃ©sultat diffÃ©rent selon l'argument."
                }
            },
            {
                title: "Valeurs de retour",
                theory: "Certaines mÃ©thodes **retournent** un rÃ©sultat. Dans ce cas, on utilise un type de retour Ã  la place de `void`, puis `return` pour renvoyer la valeur calculÃ©e.",
                code: `public static int add(int a, int b) {\n  return a + b;\n}\n\nint result = add(3, 7); // 10`,
                animation: {
                    type: "variable",
                    varName: "result",
                    varType: "int",
                    value: 10,
                    label: "La mÃ©thode calcule puis renvoie une valeur au code appelant."
                }
            },
            {
                title: "Surcharge de mÃ©thodes",
                theory: "La **surcharge** permet d'avoir plusieurs mÃ©thodes avec le mÃªme nom, mais des paramÃ¨tres diffÃ©rents. Java choisit automatiquement la bonne version selon les arguments passÃ©s.",
                code: `static int add(int a, int b) {\n  return a + b;\n}\n\nstatic double add(double a, double b) {\n  return a + b;\n}\n\nadd(3, 7);      // version int\nadd(3.5, 2.1);  // version double`,
                animation: {
                    type: "comparison",
                    left: { label: "add(3, 7)", value: "int â†’ 10" },
                    right: { label: "add(3.5, 2.1)", value: "double â†’ 5.6" },
                    label: "MÃªme nom, signatures diffÃ©rentes, comportements adaptÃ©s."
                }
            }
        ]
    },
    {
        id: "classes",
        title: "Classes et objets",
        subtitle: "Bases de la POO",
        icon: "ðŸ—ï¸",
        color: "from-fuchsia-500 to-pink-600",
        description: "CrÃ©er ses propres types avec les classes et les objets.",
        totalSlides: 4,
        slides: [
            {
                title: "Qu'est-ce qu'une classe ?",
                theory: "Une **classe** est un plan de construction pour crÃ©er des objets. Elle dÃ©finit les donnÃ©es (attributs) et les comportements (mÃ©thodes) que ses objets possÃ©deront.",
                code: `public class Dog {\n  String name;\n  int age;\n\n  void bark() {\n    System.out.println("Woof!");\n  }\n}`,
                animation: {
                    type: "variable",
                    varName: "Dog",
                    varType: "class",
                    value: "{ name, age, bark() }",
                    label: "Une classe est un modÃ¨le qui dÃ©crit des objets."
                }
            },
            {
                title: "CrÃ©er un objet",
                theory: "On utilise `new` pour crÃ©er une **instance** d'une classe. Chaque objet possÃ¨de ses propres valeurs pour les attributs dÃ©finis par la classe.",
                code: `Dog myDog = new Dog();\nmyDog.name = "Rex";\nmyDog.age = 3;\nmyDog.bark();`,
                animation: {
                    type: "variable",
                    varName: "myDog",
                    varType: "Dog",
                    value: '{ name: "Rex", age: 3 }',
                    label: "L'objet est crÃ©Ã© Ã  partir du plan `Dog`."
                }
            },
            {
                title: "Les constructeurs",
                theory: "Un **constructeur** est une mÃ©thode spÃ©ciale exÃ©cutÃ©e lors de la crÃ©ation d'un objet. Il sert gÃ©nÃ©ralement Ã  initialiser les attributs directement.",
                code: `public class Dog {\n  String name;\n  int age;\n\n  Dog(String name, int age) {\n    this.name = name;\n    this.age = age;\n  }\n}\n\nDog d = new Dog("Rex", 3);`,
                animation: {
                    type: "flow",
                    paths: [
                        { label: 'new Dog("Rex", 3)', result: true },
                        { label: "constructeur", result: true },
                        { label: "objet prÃªt", result: true, output: "{ Rex, 3 }" }
                    ],
                    label: "Le constructeur prÃ©pare l'objet dÃ¨s sa crÃ©ation."
                }
            },
            {
                title: "Plusieurs objets d'une mÃªme classe",
                theory: "On peut crÃ©er plusieurs objets Ã  partir d'une seule classe. Ils partagent la mÃªme structure, mais chacun garde ses propres donnÃ©es.",
                code: `Dog a = new Dog("Rex", 3);\nDog b = new Dog("Max", 5);\n\na.bark();\nb.bark();`,
                animation: {
                    type: "comparison",
                    left: { label: "Dog a", value: '{ "Rex", 3 }' },
                    right: { label: "Dog b", value: '{ "Max", 5 }' },
                    label: "MÃªme classe, plusieurs objets indÃ©pendants."
                }
            }
        ]
    },
    {
        id: "boolean-logic",
        title: "Logique boolÃ©enne",
        subtitle: "Vrai ou faux",
        icon: "ðŸ§ ",
        color: "from-red-500 to-rose-600",
        description: "MaÃ®triser AND, OR, NOT et les expressions boolÃ©ennes.",
        totalSlides: 4,
        slides: [
            {
                title: "Les valeurs boolÃ©ennes",
                theory: "Un `boolean` ne peut contenir que **`true`** ou **`false`**. Ces valeurs sont Ã  la base de toutes les dÃ©cisions prises par un programme.",
                code: `boolean isJavaFun = true;\nboolean isBoring = false;\n\nif (isJavaFun) {\n  System.out.println("Oui !");\n}`,
                animation: {
                    type: "gate",
                    value: "true",
                    condition: "isJavaFun == true",
                    result: true,
                    label: "isJavaFun vaut true â†’ la porte s'ouvre."
                }
            },
            {
                title: "L'opÃ©rateur ET (`&&`)",
                theory: "L'opÃ©rateur `&&` renvoie `true` seulement si **les deux conditions** sont vraies. Si une seule est fausse, le rÃ©sultat devient faux.",
                code: `int age = 25;\nboolean hasID = true;\n\nif (age >= 18 && hasID) {\n  System.out.println("EntrÃ©e autorisÃ©e");\n}`,
                animation: {
                    type: "comparison",
                    left: { label: "age >= 18", value: "true âœ“" },
                    right: { label: "hasID", value: "true âœ“" },
                    label: "Deux conditions vraies â†’ rÃ©sultat vrai."
                }
            },
            {
                title: "L'opÃ©rateur OU (`||`)",
                theory: "L'opÃ©rateur `||` renvoie `true` si **au moins une** des conditions est vraie. Les deux doivent Ãªtre fausses pour produire `false`.",
                code: `boolean isWeekend = false;\nboolean isHoliday = true;\n\nif (isWeekend || isHoliday) {\n  System.out.println("Jour de repos !");\n}`,
                animation: {
                    type: "comparison",
                    left: { label: "isWeekend", value: "false âœ—" },
                    right: { label: "isHoliday", value: "true âœ“" },
                    label: "Une seule condition vraie suffit avec OR."
                }
            },
            {
                title: "L'opÃ©rateur NON (`!`)",
                theory: "L'opÃ©rateur `!` inverse une valeur boolÃ©enne. `true` devient `false`, et `false` devient `true`. C'est trÃ¨s utile pour exprimer une nÃ©gation claire.",
                code: `boolean isRaining = false;\n\nif (!isRaining) {\n  System.out.println("Sors dehors !");\n}`,
                animation: {
                    type: "gate",
                    value: "!false",
                    condition: "!isRaining",
                    result: true,
                    label: "Le NOT inverse la condition : false devient true."
                }
            }
        ]
    }
];

export const ETIQUETTES_MATIERES: Record<MatiereCours, string> = {
    java: 'Java',
    mathematiques: 'Math',
    physique: 'Physique',
};

export const COURS_PAR_MATIERE: Record<MatiereCours, CoursApprentissage[]> = {
    java: javaCourses,
    mathematiques: mathCourses,
    physique: physicsCourses,
};

const QUIZ_PAR_COURS: Record<MatiereCours, Record<string, QuizCours>> = {
    mathematiques: {
        'derivatives-basics': {
            question: 'Que represente une derivee sur un graphique?',
            choices: [
                'La pente de la tangente',
                'La surface totale sous la courbe',
                'La valeur la plus grande du tableau',
                'Le nombre de points dessines',
            ],
            answerIndex: 0,
        },
        'integrals-basics': {
            question: 'Comment peut-on interpreter une integrale graphiquement?',
            choices: [
                'Comme une seule multiplication',
                'Comme une condition vraie ou fausse',
                'Comme une aire sous une courbe',
                'Comme le nom d une variable',
            ],
            answerIndex: 2,
        },
        'limits-basics': {
            question: 'Pour qu une limite existe en un point, que faut-il verifier?',
            choices: [
                'La fonction doit toujours etre constante',
                'Les deux cotes approchent la meme valeur',
                'La courbe doit etre une droite',
                'Le resultat doit etre un nombre entier',
            ],
            answerIndex: 1,
        },
    },
    physique: {
        'kinematics-basics': {
            question: 'Que decrit la cinematique?',
            choices: [
                'Le mouvement sans etudier sa cause',
                'La composition chimique d un objet',
                'La couleur d une lumiere',
                'La temperature d un systeme',
            ],
            answerIndex: 0,
        },
        'forces-basics': {
            question: 'Selon la deuxieme loi, que determine la somme des forces?',
            choices: [
                'La couleur de l objet',
                'Le volume de l objet',
                'La charge electrique seule',
                'L acceleration de l objet',
            ],
            answerIndex: 3,
        },
        'energy-basics': {
            question: 'Quand les frottements sont negligeables, que devient l energie mecanique totale?',
            choices: [
                'Elle disparait toujours',
                'Elle reste constante',
                'Elle devient forcement nulle',
                'Elle se transforme en masse uniquement',
            ],
            answerIndex: 1,
        },
    },
    java: {
        variables: {
            question: 'A quoi sert une variable en Java?',
            choices: [
                'A stocker une valeur avec un nom',
                'A lancer automatiquement une application',
                'A dessiner une interface graphique',
                'A supprimer le type d une donnee',
            ],
            answerIndex: 0,
        },
        'data-types': {
            question: 'Quelle affirmation decrit correctement les types en Java?',
            choices: [
                'Un int peut devenir String tout seul',
                'Java n utilise aucun type primitif',
                'Une variable garde le type declare',
                'boolean stocke du texte libre',
            ],
            answerIndex: 2,
        },
        'type-casting': {
            question: 'A quoi sert le transtypage?',
            choices: [
                'A creer une boucle infinie',
                'A comparer deux chaines avec equals',
                'A appeler une methode sans parentheses',
                'A convertir une valeur d un type vers un autre',
            ],
            answerIndex: 3,
        },
        strings: {
            question: 'Quelle methode compare correctement le contenu de deux Strings?',
            choices: [
                '== uniquement',
                '.length',
                '.equals()',
                'new',
            ],
            answerIndex: 2,
        },
        operators: {
            question: 'Quel type d operateur sert a tester une relation comme age >= 18?',
            choices: [
                'Un operateur de comparaison',
                'Un constructeur',
                'Une boucle for',
                'Un tableau',
            ],
            answerIndex: 0,
        },
        mathematiques: {
            question: 'Quelle classe Java fournit des outils comme max, min, sqrt et random?',
            choices: [
                'String',
                'Math',
                'Scanner',
                'Array',
            ],
            answerIndex: 1,
        },
        'if-statement': {
            question: 'Quand le bloc d un if est-il execute?',
            choices: [
                'Quand sa condition est fausse',
                'Avant que la condition soit testee',
                'Quand sa condition est vraie',
                'Seulement dans une classe vide',
            ],
            answerIndex: 2,
        },
        'else-if': {
            question: 'Pourquoi l ordre des conditions else if est-il important?',
            choices: [
                'Java execute toujours le dernier bloc',
                'Les conditions sont ignorees',
                'else if remplace les variables',
                'Java execute la premiere condition vraie',
            ],
            answerIndex: 3,
        },
        switch: {
            question: 'A quoi sert le mot-cle break dans un switch?',
            choices: [
                'A creer une nouvelle variable',
                'A sortir du switch apres un cas',
                'A convertir un double en int',
                'A comparer deux objets',
            ],
            answerIndex: 1,
        },
        'while-loop': {
            question: 'Quelle condition fait continuer une boucle while?',
            choices: [
                'Sa condition reste vraie',
                'Sa condition est toujours fausse',
                'Le programme atteint un constructeur',
                'Le tableau contient un String',
            ],
            answerIndex: 0,
        },
        'for-loop': {
            question: 'Quelles sont les trois parties principales d une boucle for?',
            choices: [
                'Classe, objet, constructeur',
                'Type, package, import',
                'Initialisation, condition, mise a jour',
                'Question, choix, reponse',
            ],
            answerIndex: 2,
        },
        arrays: {
            question: 'Par quel index commence un tableau Java?',
            choices: [
                '0',
                '1',
                '-1',
                'La taille du tableau',
            ],
            answerIndex: 0,
        },
        methods: {
            question: 'Pourquoi utilise-t-on des methodes?',
            choices: [
                'Pour changer le type d une variable',
                'Pour supprimer les conditions',
                'Pour empecher tout appel de code',
                'Pour regrouper et reutiliser du code',
            ],
            answerIndex: 3,
        },
        classes: {
            question: 'Quelle phrase decrit une classe?',
            choices: [
                'Une valeur true ou false',
                'Une aire sous une courbe',
                'Un plan qui definit des objets',
                'Un index de tableau uniquement',
            ],
            answerIndex: 2,
        },
        'boolean-logic': {
            question: 'Que fait l operateur ! sur une valeur booleenne?',
            choices: [
                'Il inverse true et false',
                'Il additionne deux nombres',
                'Il cree un tableau',
                'Il appelle une methode',
            ],
            answerIndex: 0,
        },
    },
};

const SUBJECTS_WITH_COURSES: MatiereCours[] = ['java', 'mathematiques', 'physique'];

function progressKey(subject: MatiereCours, courseId: string) {
    return `${subject}:${courseId}`;
}

export function obtenirCarteProgressionCours(): CarteProgressionCours {
    donneesLocales.init();
    return donneesLocales.obtenirCarteProgressionCours();
}

export function obtenirProgressionCours(subject: MatiereCours, courseId: string) {
    donneesLocales.init();
    return donneesLocales.obtenirProgressionCours(subject, courseId);
}

export function obtenirDetailsProgressionCours(subject: MatiereCours, courseId: string): DetailsProgressionCours {
    donneesLocales.init();
    return donneesLocales.obtenirDetailsProgressionCours(subject, courseId);
}

export function trouverCours(subject: MatiereCours, courseId: string) {
    return COURS_PAR_MATIERE[subject].find((CoursLocal) => CoursLocal.id === courseId);
}

export function obtenirQuizCours(subject: MatiereCours, courseId: string) {
    return QUIZ_PAR_COURS[subject][courseId];
}

function toRecentLearningCourse(subject: MatiereCours, CoursLocal: CoursApprentissage): CoursApprentissageRecent {
    const key = progressKey(subject, CoursLocal.id);
    const progressDetails = obtenirDetailsProgressionCours(subject, CoursLocal.id);

    return {
        id: key,
        courseId: CoursLocal.id,
        subject,
        name: `${ETIQUETTES_MATIERES[subject]} - ${CoursLocal.title}`,
        progress: progressDetails.progress,
        completed: progressDetails.completed,
        totalSlides: CoursLocal.totalSlides,
        highestSlideIndex: progressDetails.highestSlideIndex,
        exerciseCompleted: progressDetails.exerciseCompleted,
    };
}

export function obtenirResumesCoursApprentissage() {
    // Builds one tracking summary for every real CoursLocal in the catalog so CoursLocal tabs and profile use identical IDs.
    return SUBJECTS_WITH_COURSES.flatMap((subject) =>
        COURS_PAR_MATIERE[subject].map((CoursLocal) => toRecentLearningCourse(subject, CoursLocal))
    );
}

export function obtenirCoursApprentissageRecents(limit = 6) {
    donneesLocales.init();
    // Keeps the profile panel limited to recently opened catalog courses, ignoring stale local records for removed courses.
    const allCoursesById = new Map(
        SUBJECTS_WITH_COURSES.flatMap((subject) =>
            COURS_PAR_MATIERE[subject].map((CoursLocal) => [progressKey(subject, CoursLocal.id), { subject, CoursLocal }] as const)
        )
    );
    const orderedRecents = donneesLocales.obtenirCoursRecents(limit)
        .map((storedCourse) => {
            const catalogCourse = allCoursesById.get(String(storedCourse.id));

            if (!catalogCourse) {
                return undefined;
            }

            return {
                id: String(storedCourse.id),
                courseId: catalogCourse.CoursLocal.id,
                subject: catalogCourse.subject,
                name: `${ETIQUETTES_MATIERES[catalogCourse.subject]} - ${catalogCourse.CoursLocal.title}`,
                progress: storedCourse.progress,
                completed: storedCourse.completed,
                totalSlides: catalogCourse.CoursLocal.totalSlides,
                highestSlideIndex: storedCourse.highestSlideIndex ?? -1,
                exerciseCompleted: Boolean(storedCourse.exerciseCompleted),
            };
        })
        .filter((CoursLocal): CoursLocal is CoursApprentissageRecent => Boolean(CoursLocal));

    return orderedRecents.slice(0, limit);
}

