/* روبيكو: الكواكب والمهمات (الدروس، الخرائط، الحلول) */
const CONSOLE_MAP = ["#####", "#.R.#", "#####"];
const PLANETS = [
  {
    title: "أول أمر", concept: "الأوامر",
    missions: [{
      title: "أول أمر للروبوت",
      lesson: [
        "الروبوت ما يفهم كلامنا العادي. يفهم <b>أوامر</b> مكتوبة بطريقة معينة، وهذي الطريقة اسمها <b>لغة برمجة</b>. إحنا بنستخدم لغة اسمها JavaScript.",
        "الأمر <code>right()</code> معناه: «امشِ خطوة وحدة لليمين». القوسين <code>()</code> معناهم «نفّذ الحين»، والفاصلة المنقوطة <code>;</code> مثل النقطة في آخر الجملة.",
        "اكتبي الأمر، واضغطي زر <b>تشغيل</b>، وشوفي وش يصير. ما فيه شي يخرب، جربي براحتك."
      ],
      sample: "right();   // خطوة لليمين",
      task: "أوصلي الروبوت إلى العلم.",
      map: ["######", "#R..G#", "######"],
      starter: "// اكتبي أوامرك هنا\nright();\n",
      hint: "العلم يبعد 3 خانات. اكتبي <code>right();</code> ثلاث مرات، كل أمر في سطر.",
      solution: "right();\nright();\nright();\n"
    }]
  },
  {
    title: "ترتيب الأوامر", concept: "التسلسل",
    missions: [{
      title: "الكود يمشي من فوق لتحت",
      lesson: [
        "الكمبيوتر يقرأ الكود مثل ما نقرأ قائمة: من أول سطر لآخر سطر، سطر بعد سطر. لو غيرتي الترتيب يتغير طريق الروبوت.",
        "عندك أربع اتجاهات: <code>right()</code> يمين، <code>left()</code> يسار، <code>up()</code> فوق، <code>down()</code> تحت.",
        "النص اللي بعد <code>//</code> اسمه <b>تعليق</b>. الكمبيوتر يتجاهله، ونكتبه عشان نشرح لأنفسنا."
      ],
      sample: "right();\ndown();   // بعدها ينزل خانة\nleft();",
      task: "امشي في الممر حتى تصلين للعلم بدون ما تصطدمين بجدار.",
      map: ["######", "#R..##", "###.##", "###.G#", "######"],
      starter: "right();\nright();\n",
      hint: "يمين مرتين، تحت مرتين، ثم يمين مرة.",
      solution: "right();\nright();\ndown();\ndown();\nright();\n"
    }]
  },
  {
    title: "حلقة for", concept: "التكرار",
    missions: [
      {
        title: "ليش نكرر؟",
        lesson: [
          "تخيلي تبين الروبوت يمشي 6 خطوات. تقدرين تكتبين <code>right();</code> ست مرات، بس تخيلي لو كانت 100 خطوة!",
          "الحلقة <b>loop</b> تقول للكمبيوتر: «كرر هذا الكلام كذا مرة». كل اللي تكتبينه بين القوسين المعقوفين <code>{ }</code> يتكرر.",
          "الحين لا تشيلين هم الكلام اللي داخل القوس الأول، بنشرحه في المهمة الجاية. ركزي بس على الرقم: هو عدد مرات التكرار."
        ],
        sample: "for (let i = 0; i < 3; i++) {\n  right();   // هذا السطر يتكرر 3 مرات\n}",
        task: "الطريق 6 خطوات. غيري رقم التكرار عشان يوصل الروبوت للعلم.",
        map: ["#########", "#R.....G#", "#########"],
        starter: "for (let i = 0; i < 2; i++) {\n  right();\n}\n",
        hint: "عدّي الخانات من الروبوت إلى العلم: 6. غيري الرقم <code>2</code> إلى <code>6</code>.",
        solution: "for (let i = 0; i < 6; i++) {\n  right();\n}\n",
        needs: [{ re: /\bfor\s*\(/, msg: "وصلتِ! بس المهمة هذي تطلب استخدام حلقة for." }]
      },
      {
        title: "العدّاد i",
        lesson: [
          "داخل قوس <code>for</code> فيه ثلاث أجزاء مفصولة بـ <code>;</code>، وكلها عن عدّاد اسمه <code>i</code>، مثل ما تعدين على أصابعك:",
          "<code>let i = 0</code> ابدئي العد من صفر.<br><code>i &lt; 4</code> كملي طالما العدد أقل من 4.<br><code>i++</code> بعد كل لفة زيدي العدد واحد.",
          "يعني i يصير 0 ثم 1 ثم 2 ثم 3، ولما يوصل 4 يوقف لأن 4 مو أقل من 4. عشان كذا الحلقة تتكرر 4 مرات.",
          "الأمر <code>say()</code> يخلي الروبوت يقول أي شي تحطينه بين القوسين. بنستخدمه عشان نشوف قيمة العدّاد."
        ],
        sample: "for (let i = 0; i < 3; i++) {\n  say(i);   // يقول: 0 ثم 1 ثم 2\n}",
        task: "خلي الروبوت يمشي 4 خطوات، وبعد كل خطوة يقول قيمة i.",
        map: ["#######", "#R...G#", "#######"],
        starter: "for (let i = 0; i < 4; i++) {\n  right();\n  // خليه يقول قيمة i هنا\n}\n",
        hint: "تحت <code>right();</code> اكتبي <code>say(i);</code>",
        solution: "for (let i = 0; i < 4; i++) {\n  right();\n  say(i);\n}\n",
        needs: [{ re: /\bfor\s*\(/, msg: "استخدمي حلقة for." }],
        check: res => res.says.join(",") === "0,1,2,3" ? null : "الروبوت لازم يقول 0 ثم 1 ثم 2 ثم 3. حطي say(i); داخل الحلقة تحت right();"
      },
      {
        title: "أكثر من أمر في اللفة",
        lesson: [
          "داخل <code>{ }</code> تقدرين تحطين كم أمر تبين. في كل لفة تتنفذ كلها بالترتيب، من فوق لتحت، وبعدين تبدأ اللفة اللي بعدها.",
          "شوفي الدرج: كل درجة هي «يمين ثم تحت». يعني نفس الحركتين تتكرر كذا مرة."
        ],
        sample: "for (let i = 0; i < 2; i++) {\n  right();\n  up();\n}\n// يمين، فوق، يمين، فوق",
        task: "انزلي الدرج للعلم. كل درجة: خطوة يمين وخطوة تحت.",
        map: ["#######", "#R.####", "##..###", "###..##", "####..#", "#####G#", "#######"],
        starter: "for (let i = 0; i < 4; i++) {\n  right();\n  // وبعدها؟\n}\n",
        hint: "تحت <code>right();</code> أضيفي <code>down();</code>",
        solution: "for (let i = 0; i < 4; i++) {\n  right();\n  down();\n}\n",
        needs: [{ re: /\bfor\s*\(/, msg: "وصلتِ! بس جربي الحل بحلقة for." }]
      },
      {
        title: "حلقتين ورا بعض",
        lesson: [
          "تقدرين تكتبين أكثر من حلقة. الكمبيوتر يخلص الحلقة الأولى كاملة، وبعدين يبدأ اللي بعدها.",
          "هذا مفيد لما يكون الطريق فيه أكثر من اتجاه."
        ],
        sample: "for (let i = 0; i < 3; i++) {\n  right();\n}\nfor (let i = 0; i < 2; i++) {\n  down();\n}",
        task: "الطريق: 7 خطوات يمين، وبعدها 3 خطوات تحت.",
        map: ["##########", "#R.......#", "########.#", "########.#", "########G#", "##########"],
        starter: "for (let i = 0; i < 7; i++) {\n  right();\n}\n\n// الحلقة الثانية هنا\n",
        hint: "انسخي الحلقة، والصقيها تحتها، وغيري <code>right</code> إلى <code>down</code> والرقم إلى 3.",
        solution: "for (let i = 0; i < 7; i++) {\n  right();\n}\n\nfor (let i = 0; i < 3; i++) {\n  down();\n}\n",
        needs: [{ re: /\bfor\s*\([\s\S]*\bfor\s*\(/, msg: "وصلتِ! بس المهمة تطلب حلقتين for." }]
      }
    ]
  },
  {
    title: "المتغيرات", concept: "تخزين القيم",
    missions: [
      {
        title: "وش هو الكونسول؟", mode: "console",
        lesson: [
          "المبرمجين يحتاجون يشوفون وش يصير داخل البرنامج. عشان كذا فيه مكان اسمه <b>الكونسول console</b>، وهو مثل دفتر ملاحظات البرنامج: يكتب فيه رسائل لك.",
          "الأمر <code>console.log()</code> يكتب في الكونسول أي شي تحطينه بين القوسين. كلمة log معناها «سجّل».",
          "في اللعبة، الكونسول هو صندوق <b>رسائل الروبوت</b>. وبرا اللعبة تلقينه في المتصفح لما تضغطين F12.",
          "<b>مهم:</b> الكلام العادي (اسمه نص string) لازم يكون بين علامتي تنصيص <code>\"...\"</code>. الأرقام تنكتب بدون تنصيص، والكمبيوتر يحسبها لك."
        ],
        sample: 'console.log("مرحبا");    // يطبع: مرحبا\nconsole.log(5 + 3);      // يطبع: 8\nconsole.log("5 + 3");    // يطبع: 5 + 3 لأنه نص',
        task: "اطبعي في الكونسول جملة تختارينها، وبعدها خلي الكمبيوتر يحسب لك 12 + 30.",
        map: CONSOLE_MAP,
        starter: '// اطبعي جملتك هنا\nconsole.log("");\n\n// واحسبي 12 + 30\n',
        hint: "اكتبي جملتك بين علامتي التنصيص في السطر الأول. وتحت: <code>console.log(12 + 30);</code> بدون علامات تنصيص.",
        solution: 'console.log("أنا أتعلم جافا سكربت");\nconsole.log(12 + 30);\n',
        check: res => {
          if (!res.says.some(s => s.trim() && isNaN(s))) return "اطبعي جملة نصية بين علامتي تنصيص، ولا تخلينها فاضية.";
          if (res.says.includes("42")) return null;
          if (res.says.some(s => /12\s*\+\s*30/.test(s))) return "طلع لك 12 + 30 كنص! شيلي علامات التنصيص عشان الكمبيوتر يحسبها.";
          return "ما طلع الرقم 42. اكتبي console.log(12 + 30);";
        }
      },
      {
        title: "أول متغير", mode: "console",
        lesson: [
          "المتغير <b>variable</b> مثل صندوق عليه اسم. تحطين فيه قيمة، وبعدين تستخدمين الاسم بدل ما تكتبين القيمة كل مرة.",
          "<code>let</code> معناها «سوّي صندوق جديد». بعدها اسم الصندوق، وبعدها <code>=</code>، وبعدها القيمة.",
          "<b>انتبهي:</b> <code>=</code> في البرمجة معناها «حطي داخل»، مو «يساوي» مثل الرياضيات.",
          "لما تكتبين اسم المتغير في <code>console.log</code> <b>بدون</b> علامات تنصيص، يطبع اللي داخل الصندوق."
        ],
        sample: 'let robotName = "روبيكو";\nlet battery = 100;\n\nconsole.log(robotName);   // روبيكو\nconsole.log(battery);     // 100\nconsole.log("robotName"); // robotName لأنه نص عادي',
        task: "سوي متغير اسمه <code>moons</code> فيه عدد أقمار المريخ (2)، واطبعيه تحت المتغير planet.",
        map: CONSOLE_MAP,
        starter: 'let planet = "المريخ";\n\n// سوي متغير moons هنا\n\nconsole.log(planet);\n',
        hint: "أضيفي <code>let moons = 2;</code> وفي الأخير <code>console.log(moons);</code>",
        solution: 'let planet = "المريخ";\nlet moons = 2;\n\nconsole.log(planet);\nconsole.log(moons);\n',
        needs: [{ re: /\blet\s+moons\s*=/, msg: "سوي متغير اسمه moons بالضبط: let moons = 2;" }],
        check: (res, code) => {
          if (!/(console\.log|say)\s*\(\s*moons\s*\)/.test(code)) return "اطبعي المتغير باسمه بدون علامات تنصيص: console.log(moons);";
          if (!res.says.includes("2")) return "قيمة moons لازم تكون 2.";
          return null;
        }
      },
      {
        title: "تغيير القيمة",
        lesson: [
          "الصندوق اللي سويتيه بـ <code>let</code> تقدرين تغيرين اللي داخله في أي وقت. ما تكتبين <code>let</code> مرة ثانية، بس الاسم و <code>=</code> والقيمة الجديدة.",
          "<code>score = score + 1</code> تنقرأ: «خذي اللي في score، وزيدي عليه 1، ورجعيه في score». مثل عدّاد النقاط في الألعاب.",
          "الأمر <code>pick()</code> يخلي الروبوت يلتقط الجوهرة اللي تحته. و <code>say()</code> مثل <code>console.log()</code> بالضبط، بس الروبوت يقولها."
        ],
        sample: "let score = 0;\nscore = score + 10;\nscore = score + 5;\nsay(score);   // 15",
        task: "اجمعي الجواهر الثلاث، وكل ما التقطتي وحدة زيدي العدّاد <code>gems</code> واحد. وفي الأخير خلي الروبوت يقول كم جمع.",
        map: ["#########", "#R*.*.*G#", "#########"],
        starter: "let gems = 0;\n\nright();\npick();\ngems = gems + 1;\n\nright();\nright();\n// كملي...\n",
        hint: "كرري نفس الشي عند كل جوهرة: <code>pick();</code> ثم <code>gems = gems + 1;</code>. وبعد آخر <code>right();</code> اكتبي <code>say(gems);</code>",
        solution: "let gems = 0;\n\nright();\npick();\ngems = gems + 1;\n\nright();\nright();\npick();\ngems = gems + 1;\n\nright();\nright();\npick();\ngems = gems + 1;\n\nright();\nsay(gems);\n",
        check: (res, code) => {
          if (!/gems\s*(=\s*gems\s*\+|\+\+|\+=)/.test(code)) return "زيدي العدّاد بنفسك: gems = gems + 1;";
          if (/say\s*\(\s*3\s*\)/.test(code)) return "لا تكتبين 3 بنفسك، خلي الروبوت يقول المتغير: say(gems);";
          if (!res.says.includes("3")) return "الروبوت لازم يقول قيمة gems في الأخير: say(gems);";
          return null;
        }
      },
      {
        title: "const والحساب",
        lesson: [
          "فيه نوعين صناديق: <code>let</code> لقيمة ممكن تتغير، و <code>const</code> لقيمة ثابتة ما تتغير أبداً. لو حاولتي تغيرين const يطلع لك خطأ.",
          "تقدرين تحسبين بالمتغيرات: <code>+</code> جمع، <code>-</code> طرح، <code>*</code> ضرب، <code>/</code> قسمة.",
          "وتقدرين تحطين المتغير داخل الحلقة بدل الرقم. لو غيرتي قيمته مرة وحدة فوق، يتغير كل مكان يستخدمه."
        ],
        sample: "const steps = 3;\nsay(steps * 2);    // 6\nsay(steps + 10);   // 13\n\nfor (let i = 0; i < steps; i++) {\n  right();\n}",
        task: "استخدمي المتغير steps عشان ينزل الروبوت ثم يروح يمين. وفي النهاية خليه يقول عدد كل الخطوات (8) بدون ما تكتبين الرقم 8 بنفسك.",
        map: ["#######", "#R#####", "#.#####", "#.#####", "#.#####", "#....G#", "#######"],
        starter: "const steps = 4;\n\nfor (let i = 0; i < steps; i++) {\n  down();\n}\n\n// أكملي: تحركي يمين بنفس العدد\n",
        hint: "انسخي الحلقة وغيري <code>down()</code> إلى <code>right()</code>. بعدها اكتبي <code>say(steps * 2);</code>",
        solution: "const steps = 4;\n\nfor (let i = 0; i < steps; i++) {\n  down();\n}\n\nfor (let i = 0; i < steps; i++) {\n  right();\n}\n\nsay(steps * 2);\n",
        needs: [
          { re: /\b(let|const|var)\s+\w+/, msg: "المهمة تطلب تعريف متغير بـ let أو const." },
          { re: /\bsay\s*\(|console\.log\s*\(/, msg: "وصلتِ! باقي تخلين الروبوت يقول عدد الخطوات باستخدام say()." }
        ],
        check: (res, code) => {
          if (/say\s*\(\s*8\s*\)/.test(code)) return "حلو، بس احسبيها من المتغير بدل ما تكتبين 8: say(steps * 2);";
          if (!res.says.some(s => /(^|\D)8(\D|$)/.test(s))) return "الروبوت ما قال الرقم 8. استخدمي say(steps * 2);";
          return null;
        }
      }
    ]
  },
  {
    title: "الشرط if", concept: "اتخاذ القرار",
    missions: [
      {
        title: "صح أو غلط", mode: "console",
        lesson: [
          "في البرمجة فيه نوع قيمة خاص اسمه <b>boolean</b>، وله قيمتين بس: <code>true</code> يعني صح، و <code>false</code> يعني غلط.",
          "لما تسألين الكمبيوتر سؤال مقارنة، يجاوبك بـ true أو false.",
          "<code>&gt;</code> أكبر من، <code>&lt;</code> أصغر من، <code>===</code> يساوي. انتبهي: المقارنة بثلاث علامات <code>===</code>، لأن العلامة الوحدة <code>=</code> معناها «حطي داخل»."
        ],
        sample: "say(10 > 3);     // true\nsay(2 > 8);      // false\nsay(5 === 5);    // true",
        task: "خلي الروبوت يسأل: هل 7 أكبر من 4؟ وبعدها: هل 9 يساوي 6؟",
        map: CONSOLE_MAP,
        starter: "// هل 7 أكبر من 4؟\nsay();\n\n// هل 9 يساوي 6؟\n",
        hint: "<code>say(7 > 4);</code> وتحتها <code>say(9 === 6);</code>",
        solution: "say(7 > 4);\nsay(9 === 6);\n",
        check: (res, code) => {
          if (/say\s*\(\s*(true|false)\s*\)/.test(code)) return "لا تكتبين true أو false بنفسك! خلي الكمبيوتر يقارن: say(7 > 4);";
          if (res.says.filter(Boolean).join(",") !== "true,false") return "الروبوت لازم يقول true وبعدها false. استخدمي > و ===";
          return null;
        }
      },
      {
        title: "أول if",
        lesson: [
          "<code>if</code> معناها «إذا». تعطينها سؤال بين قوسين <code>( )</code>. إذا كان الجواب <code>true</code> ينفذ الكود اللي بين <code>{ }</code>، وإذا <code>false</code> يتخطاه.",
          "<code>gemHere()</code> سؤال جاهز معناه «فيه جوهرة تحتي؟»، ويرجع true أو false.",
          "ليش نحتاجه؟ لأن <code>pick()</code> بدون جوهرة تحت الروبوت يطلع خطأ. فنسأل قبل ما نلتقط."
        ],
        sample: "if (gemHere()) {\n  pick();   // ما تتنفذ إلا إذا فيه جوهرة\n}",
        task: "امشي خطوة، وإذا فيه جوهرة التقطيها، وبعدها كملي للعلم.",
        map: ["######", "#R*.G#", "######"],
        starter: "right();\n\n// اسألي: فيه جوهرة؟\n\nright();\nright();\n",
        hint: "بعد أول <code>right();</code> اكتبي:<br><code>if (gemHere()) {</code><br><code>&nbsp;&nbsp;pick();</code><br><code>}</code>",
        solution: "right();\n\nif (gemHere()) {\n  pick();\n}\n\nright();\nright();\n",
        needs: [{ re: /\bif\s*\(/, msg: "صح، بس المهمة تطلب تستخدمين if قبل pick()." }]
      },
      {
        title: "if داخل حلقة",
        lesson: [
          "لما تحطين if داخل حلقة، السؤال ينسأل في <b>كل لفة</b> من جديد. فالروبوت يتصرف حسب الخانة اللي هو فيها.",
          "كذا ما تحتاجين تعرفين وين الجواهر بالضبط، الروبوت يقرر بنفسه."
        ],
        sample: "for (let i = 0; i < 5; i++) {\n  right();\n  if (gemHere()) {\n    pick();\n  }\n}",
        task: "اجمعي كل الجواهر في الممر ثم وصلي للعلم.",
        map: ["###########", "#R.*.**.*G#", "###########"],
        starter: "for (let i = 0; i < 8; i++) {\n  right();\n  // اكتبي الشرط هنا\n}\n",
        hint: "داخل الحلقة بعد <code>right();</code> اكتبي: <code>if (gemHere()) { pick(); }</code>",
        solution: "for (let i = 0; i < 8; i++) {\n  right();\n  if (gemHere()) {\n    pick();\n  }\n}\n",
        needs: [{ re: /\bif\s*\(/, msg: "استخدمي if عشان تقررين متى تلتقطين الجوهرة." }]
      },
      {
        title: "وإلا else",
        lesson: [
          "<code>else</code> معناها «وإلا». الكود اللي بعدها يتنفذ لما يكون جواب if هو <code>false</code>.",
          "يعني دايماً واحد من الاثنين يتنفذ: إما اللي في if أو اللي في else، وأبداً ما يتنفذون الاثنين مع بعض."
        ],
        sample: 'if (gemHere()) {\n  pick();\n} else {\n  say("فاضي");\n}',
        task: 'امشي للعلم. في كل خانة: إذا فيه جوهرة التقطيها، وإلا خلي الروبوت يقول "فاضي".',
        map: ["#########", "#R.*..*G#", "#########"],
        starter: "for (let i = 0; i < 6; i++) {\n  right();\n  if (gemHere()) {\n    pick();\n  }\n  // أضيفي else بعد القوس } مباشرة\n}\n",
        hint: 'غيري القوس <code>}</code> اللي بعد pick إلى:<br><code>} else {</code><br><code>&nbsp;&nbsp;say("فاضي");</code><br><code>}</code>',
        solution: 'for (let i = 0; i < 6; i++) {\n  right();\n  if (gemHere()) {\n    pick();\n  } else {\n    say("فاضي");\n  }\n}\n',
        needs: [{ re: /\belse\b/, msg: "المهمة تطلب else." }],
        check: res => {
          const n = res.says.length;
          return n === 4 ? null : `الروبوت تكلم ${n} مرات، والمفروض 4 (عدد الخانات الفاضية). تأكدي أن say داخل else بس.`;
        }
      }
    ]
  },
  {
    title: "حلقة while", concept: "التكرار بشرط",
    missions: [
      {
        title: "سؤال canMove", mode: "console",
        lesson: [
          "قبل ما نتعلم حلقة جديدة، نتعرف على سؤال جديد: <code>canMove(\"right\")</code> يعني «أقدر أمشي لليمين؟». يرجع <code>true</code> إذا الطريق مفتوح، و <code>false</code> إذا فيه جدار.",
          "الاتجاه ينكتب كنص بين علامتي تنصيص: <code>\"right\"</code> و <code>\"left\"</code> و <code>\"up\"</code> و <code>\"down\"</code>."
        ],
        sample: 'say(canMove("down"));   // true أو false',
        task: "الروبوت في غرفة صغيرة. خليه يقول: يقدر يمشي يمين؟ وبعدها: يقدر يمشي فوق؟",
        map: ["####", "#R.#", "####"],
        starter: 'say(canMove("right"));\n\n// واسألي عن فوق\n',
        hint: 'اكتبي <code>say(canMove("up"));</code>',
        solution: 'say(canMove("right"));\nsay(canMove("up"));\n',
        needs: [{ re: /canMove\s*\(\s*["']up["']\s*\)/, msg: 'اسألي عن فوق: canMove("up")' }],
        check: res => res.says.join(",") === "true,false" ? null : "الروبوت لازم يقول true (يمين مفتوح) وبعدها false (فوق جدار)."
      },
      {
        title: "كرري طالما",
        lesson: [
          "<code>for</code> نستخدمها لما نعرف كم مرة بالضبط. بس أحياناً ما نعرف! مثلاً: «امشي لين توصلين الجدار».",
          "هنا نستخدم <code>while</code> ومعناها «طالما». تسأل السؤال: إذا true تنفذ اللي داخلها، وترجع تسأل من جديد. وتوقف أول ما يصير الجواب false.",
          "<b>انتبهي:</b> لو السؤال يظل true للأبد، الحلقة ما توقف أبداً! هذي اسمها <b>حلقة لا نهائية</b>، واللعبة بتوقفها لك وتنبهك."
        ],
        sample: 'while (canMove("right")) {\n  right();\n}\n// يمشي يمين لين يوصل الجدار',
        task: "ما ندري كم طول الممر! خلي الروبوت يمشي يمين لين الجدار باستخدام while.",
        map: ["############", "#R........G#", "############"],
        starter: 'while (canMove("")) {\n  right();\n}\n',
        hint: 'حطي <code>"right"</code> بين علامتي التنصيص داخل canMove.',
        solution: 'while (canMove("right")) {\n  right();\n}\n',
        needs: [{ re: /\bwhile\s*\(/, msg: "وصلتِ! بس جربي الحل باستخدام while." }]
      },
      {
        title: "اتجاهات كثيرة",
        lesson: [
          "تقدرين تكتبين أكثر من while ورا بعض. كل وحدة تمشي باتجاه لين الجدار، وبعدها اللي بعدها تبدأ.",
          "الحلو هنا إنك ما تحتاجين تعدين الخانات أبداً."
        ],
        sample: 'while (canMove("up")) {\n  up();\n}\nwhile (canMove("left")) {\n  left();\n}',
        task: "وصلي للعلم: يمين لين الجدار، تحت لين الجدار، يسار لين الجدار.",
        map: ["########", "#R....##", "#####.##", "#####.##", "#G....##", "########"],
        starter: 'while (canMove("right")) {\n  right();\n}\n',
        hint: 'أضيفي حلقة while ثانية بالاتجاه <code>"down"</code>، وثالثة بالاتجاه <code>"left"</code>.',
        solution: 'while (canMove("right")) {\n  right();\n}\n\nwhile (canMove("down")) {\n  down();\n}\n\nwhile (canMove("left")) {\n  left();\n}\n',
        needs: [{ re: /\bwhile\s*\(/, msg: "وصلتِ! بس جربي الحل باستخدام while بدل العد." }]
      },
      {
        title: "عدّاد مع while",
        lesson: [
          "while ما فيها عدّاد جاهز مثل for. بس تقدرين تسوين واحد بنفسك بمتغير!",
          "<code>steps++</code> اختصار لـ <code>steps = steps + 1</code>."
        ],
        sample: "let count = 0;\ncount++;\ncount++;\nsay(count);   // 2",
        task: "امشي لين الجدار، واحسبي كم خطوة مشيتي، وخلي الروبوت يقولها في الأخير.",
        map: ["##########", "#R......G#", "##########"],
        starter: 'let steps = 0;\n\nwhile (canMove("right")) {\n  right();\n  // زيدي العدّاد هنا\n}\n\n// خلي الروبوت يقول steps\n',
        hint: "داخل الحلقة تحت <code>right();</code> اكتبي <code>steps++;</code>. وبعد الحلقة: <code>say(steps);</code>",
        solution: 'let steps = 0;\n\nwhile (canMove("right")) {\n  right();\n  steps++;\n}\n\nsay(steps);\n',
        needs: [{ re: /\bwhile\s*\(/, msg: "استخدمي while." }],
        check: (res, code) => {
          if (/say\s*\(\s*7\s*\)/.test(code)) return "لا تكتبين الرقم بنفسك، خلي العدّاد يحسب: say(steps);";
          if (!res.says.includes("7")) return "الروبوت لازم يقول عدد الخطوات (7). زيدي steps++ داخل الحلقة، وقولي say(steps) بعدها.";
          return null;
        }
      }
    ]
  },
  {
    title: "دوالك الخاصة", concept: "الدوال",
    missions: [
      {
        title: "وش هي الدالة؟", mode: "console",
        lesson: [
          "تذكرين <code>right()</code> و <code>say()</code>؟ هذي كلها <b>دوال functions</b>. الدالة مجموعة أوامر لها اسم، ولما تنادينها باسمها تتنفذ كل الأوامر اللي فيها.",
          "مثل وصفة الكيك: تكتبينها مرة وحدة في الدفتر، وكل ما بغيتي كيك ترجعين لها بدل ما تكتبين الخطوات من جديد.",
          "تسوين دالة بكلمة <code>function</code>، بعدها الاسم، بعدها <code>()</code>، وبعدها الأوامر بين <code>{ }</code>. هذا اسمه <b>تعريف</b> الدالة، وما ينفذ شي لحاله! لازم <b>تنادينها</b> باسمها: <code>hello();</code>"
        ],
        sample: 'function hello() {\n  say("هلا والله!");\n}\n\nhello();   // نادينا الدالة\nhello();   // ونادينا مرة ثانية',
        task: 'سوي دالة اسمها <code>cheer</code> تخلي الروبوت يقول "يلا نبرمج!"، ونادي عليها 3 مرات.',
        map: CONSOLE_MAP,
        starter: "function cheer() {\n  // اكتبي هنا\n}\n\n// نادي على الدالة 3 مرات\n",
        hint: 'داخل الدالة: <code>say("يلا نبرمج!");</code>. وتحت الدالة اكتبي <code>cheer();</code> ثلاث مرات.',
        solution: 'function cheer() {\n  say("يلا نبرمج!");\n}\n\ncheer();\ncheer();\ncheer();\n',
        needs: [{ re: /\bfunction\s+cheer\s*\(/, msg: "عرّفي دالة اسمها cheer: function cheer() { ... }" }],
        check: (res, code) => {
          if ((code.match(/\bcheer\s*\(\s*\)/g) || []).length < 4) return "نادي على الدالة ثلاث مرات: cheer();";
          if (res.says.length < 3) return "الروبوت ما تكلم. حطي say داخل الدالة.";
          return null;
        }
      },
      {
        title: "دالة تحرك الروبوت",
        lesson: [
          "الدالة تقدر تحتوي أوامر حركة. لما تشوفين نفس الحركات تتكرر، حطيها في دالة وعطيها اسم واضح.",
          "وتقدرين تنادين الدالة داخل حلقة! كذا الكود يصير قصير وسهل تقرينه."
        ],
        sample: "function zigzag() {\n  up();\n  right();\n}\n\nfor (let i = 0; i < 3; i++) {\n  zigzag();\n}",
        task: "اطلعي الدرج للعلم. استخدمي الدالة climb داخل حلقة.",
        map: ["########", "#####.G#", "####..##", "###..###", "##..####", "#R.#####", "########"],
        starter: "function climb() {\n  right();\n  up();\n}\n\nclimb();\n",
        hint: "الدرج فيه 4 درجات، وبعدها خطوة يمين أخيرة. حطي <code>climb();</code> داخل حلقة for تتكرر 4 مرات.",
        solution: "function climb() {\n  right();\n  up();\n}\n\nfor (let i = 0; i < 4; i++) {\n  climb();\n}\nright();\n",
        needs: [{ re: /\bfunction\s+\w+\s*\(/, msg: "المهمة تطلب دالة باستخدام function." }]
      },
      {
        title: "مُدخلات الدالة",
        lesson: [
          "أحياناً نبي الدالة تشتغل بشكل مختلف كل مرة. مثلاً «امشي يمين»، بس مرة خطوتين ومرة 4.",
          "نحط بين قوسين الدالة اسم مثل <code>steps</code>. هذا اسمه <b>مُدخل parameter</b>، وهو متغير يجي قيمته من اللي ينادي الدالة.",
          "لما تكتبين <code>walkRight(3)</code>، الرقم 3 يروح ويتحط داخل <code>steps</code>."
        ],
        sample: 'function greet(name) {\n  say("مرحبا " + name);\n}\n\ngreet("سارة");   // مرحبا سارة\ngreet("نورة");   // مرحبا نورة',
        task: "استخدمي الدالة <code>walkRight</code> عشان توصلين العلم: يمين 2، تحت 2، يمين 4.",
        map: ["#########", "#R..#####", "###.#####", "###....G#", "#########"],
        starter: "function walkRight(steps) {\n  for (let i = 0; i < steps; i++) {\n    right();\n  }\n}\n\nwalkRight(2);\n",
        hint: "بعد <code>walkRight(2);</code> انزلي خطوتين بـ <code>down();</code> وبعدين <code>walkRight(4);</code>",
        solution: "function walkRight(steps) {\n  for (let i = 0; i < steps; i++) {\n    right();\n  }\n}\n\nwalkRight(2);\ndown();\ndown();\nwalkRight(4);\n",
        needs: [{ re: /\bfunction\s+\w+\s*\(\s*\w+/, msg: "استخدمي دالة فيها مُدخل مثل walkRight(steps)." }]
      },
      {
        title: "return: الدالة ترجع جواب", mode: "console",
        lesson: [
          "بعض الدوال <b>تسوي</b> شي (مثل right تحرك الروبوت). وبعضها <b>ترجع جواب</b>، مثل gemHere() ترجع true أو false.",
          "كلمة <code>return</code> معناها «هذا جوابي». الدالة توقف عندها وترجع القيمة للي ناداها.",
          "مثل الآلة الحاسبة: تعطينها أرقام، وترجع لك النتيجة."
        ],
        sample: "function double(x) {\n  return x * 2;\n}\n\nsay(double(5));    // 10\nsay(double(21));   // 42",
        task: "كملي الدالة <code>add</code> عشان ترجع مجموع الرقمين a و b. الروبوت بيقول add(7, 5) واللي لازم يطلع 12.",
        map: CONSOLE_MAP,
        starter: "function add(a, b) {\n  // رجّعي مجموع a و b\n}\n\nsay(add(7, 5));\n",
        hint: "داخل الدالة اكتبي <code>return a + b;</code>",
        solution: "function add(a, b) {\n  return a + b;\n}\n\nsay(add(7, 5));\n",
        check: (res, code) => {
          if (res.says.includes("undefined")) return "الدالة رجعت undefined، يعني «ما فيه جواب». ناقصك return.";
          if (/return\s+12\b/.test(code)) return "خلي الدالة تحسبها بنفسها: return a + b;";
          if (!res.says.includes("12")) return "الجواب لازم يطلع 12. تأكدي إنك كتبتي return a + b;";
          return null;
        },
        needs: [{ re: /\breturn\b/, msg: "استخدمي return." }]
      }
    ]
  },
  {
    title: "المصفوفات", concept: "القوائم",
    missions: [
      {
        title: "وش هي المصفوفة؟", mode: "console",
        lesson: [
          "المصفوفة <b>array</b> مثل قائمة المقاضي: متغير واحد فيه أكثر من قيمة بالترتيب. تكتبينها بين قوسين مربعين <code>[ ]</code> والعناصر بينها فواصل.",
          "كل عنصر له رقم مكان اسمه <b>index</b>. وانتبهي: العد يبدأ من <b>صفر</b> مو واحد! <code>list[0]</code> أول عنصر، و <code>list[1]</code> الثاني.",
          "<code>list.length</code> يعطيك عدد العناصر."
        ],
        sample: 'const fruits = ["تفاح", "موز", "عنب"];\n\nsay(fruits[0]);       // تفاح\nsay(fruits[2]);       // عنب\nsay(fruits.length);   // 3',
        task: "زيدي على المصفوفة <code>planets</code> اسمين عشان يصيرون 4 كواكب. وخلي الروبوت يقول أول كوكب، وبعدها عدد الكواكب.",
        map: CONSOLE_MAP,
        starter: 'const planets = ["عطارد", "الزهرة"];\n\n// قولي أول عنصر\n\n// قولي عدد العناصر\n',
        hint: 'زيدي اسمين: <code>["عطارد", "الزهرة", "الأرض", "المريخ"]</code>. وبعدين <code>say(planets[0]);</code> و <code>say(planets.length);</code>',
        solution: 'const planets = ["عطارد", "الزهرة", "الأرض", "المريخ"];\n\nsay(planets[0]);\nsay(planets.length);\n',
        check: (res, code) => {
          if (!/planets\s*\[\s*0\s*\]/.test(code)) return "قولي أول عنصر بـ planets[0]";
          if (!/planets\.length/.test(code)) return "قولي عدد العناصر بـ planets.length";
          if (!res.says.includes("4")) return "المصفوفة لازم يكون فيها 4 عناصر.";
          return null;
        }
      },
      {
        title: "المرور على العناصر",
        lesson: [
          "<code>for...of</code> حلقة خاصة بالمصفوفات: تمر على العناصر واحد واحد بالترتيب، وفي كل لفة تحط العنصر في متغير.",
          "<code>for (const dir of path)</code> تنقرأ: «لكل dir موجود في path، سوّي كذا».",
          "و <code>move(dir)</code> يحرك الروبوت بالاتجاه المكتوب في dir."
        ],
        sample: 'const colors = ["أحمر", "أزرق", "أخضر"];\n\nfor (const c of colors) {\n  say(c);\n}\n// أحمر، ثم أزرق، ثم أخضر',
        task: "المصفوفة path فيها خطوات الطريق. أكملي الخطوات الناقصة عشان يوصل الروبوت.",
        map: ["#####", "#R.##", "##.G#", "#####"],
        starter: 'const path = ["right"];\n\nfor (const dir of path) {\n  move(dir);\n}\n',
        hint: 'الطريق: يمين، تحت، يمين. يعني <code>["right", "down", "right"]</code>',
        solution: 'const path = ["right", "down", "right"];\n\nfor (const dir of path) {\n  move(dir);\n}\n',
        needs: [{ re: /\bfor\s*\(\s*(const|let|var)\s+\w+\s+of\b/, msg: "مري على المصفوفة باستخدام for...of." }]
      },
      {
        title: "مسار طويل",
        lesson: [
          "المصفوفة تقدر تكون طويلة. لو تبين تنزلينها على أكثر من سطر عشان تكون أوضح، عادي.",
          "الحلقة نفسها ما تتغير مهما طالت المصفوفة. هذي قوة المصفوفات!"
        ],
        sample: 'const path = [\n  "right", "right",\n  "down", "down"\n];',
        task: "أكملي المصفوفة path بكل الاتجاهات اللي توصل الروبوت للعلم.",
        map: ["#######", "#R..###", "###.###", "###...#", "#####.#", "#G....#", "#######"],
        starter: 'const path = ["right", "right", "down", "down"];\n\nfor (const dir of path) {\n  move(dir);\n}\n',
        hint: 'بعد أول أربع: يمين مرتين، تحت مرتين، ثم يسار أربع مرات. أضيفيها كنصوص مثل <code>"left"</code>.',
        solution: 'const path = [\n  "right", "right", "down", "down",\n  "right", "right", "down", "down",\n  "left", "left", "left", "left"\n];\n\nfor (const dir of path) {\n  move(dir);\n}\n',
        needs: [
          { re: /\[/, msg: "استخدمي مصفوفة [ ] للاتجاهات." },
          { re: /\bfor\s*\(\s*(const|let|var)\s+\w+\s+of\b/, msg: "مري على المصفوفة باستخدام for...of." }
        ]
      },
      {
        title: "إضافة عنصر push",
        lesson: [
          "تقدرين تضيفين عنصر جديد في آخر المصفوفة بـ <code>push()</code>.",
          "حتى لو المصفوفة <code>const</code> تقدرين تضيفين فيها، لأن الصندوق نفسه ما تغير، بس حطيتي فيه أشياء أكثر.",
          "مثلاً نبدأ بمصفوفة فاضية <code>[]</code> ونعبيها وإحنا نمشي."
        ],
        sample: 'const bag = [];\nbag.push("مفتاح");\nbag.push("خريطة");\n\nsay(bag.length);   // 2',
        task: 'كل ما التقطتي جوهرة، أضيفي "💎" للمصفوفة bag. وفي الأخير خلي الروبوت يقول كم جوهرة في الشنطة.',
        map: ["##########", "#R*.**.*G#", "##########"],
        starter: 'const bag = [];\n\nfor (let i = 0; i < 7; i++) {\n  right();\n  if (gemHere()) {\n    pick();\n    // أضيفي للشنطة هنا\n  }\n}\n\n// قولي كم عنصر في bag\n',
        hint: 'تحت <code>pick();</code> اكتبي <code>bag.push("💎");</code>. وبعد الحلقة: <code>say(bag.length);</code>',
        solution: 'const bag = [];\n\nfor (let i = 0; i < 7; i++) {\n  right();\n  if (gemHere()) {\n    pick();\n    bag.push("💎");\n  }\n}\n\nsay(bag.length);\n',
        needs: [{ re: /\.push\s*\(/, msg: "أضيفي الجواهر للمصفوفة بـ bag.push()." }],
        check: (res, code) => {
          if (/say\s*\(\s*4\s*\)/.test(code)) return "لا تكتبين 4 بنفسك: say(bag.length);";
          if (!res.says.includes("4")) return "الروبوت لازم يقول عدد العناصر في bag: say(bag.length);";
          return null;
        }
      }
    ]
  },
  {
    title: "التحدي الأخير", concept: "كل شي مع بعض",
    missions: [
      {
        title: "دالة تاخذ اتجاه",
        lesson: [
          "هذا كوكب المراجعة. بنجمع كل اللي تعلمتيه في كود قصير وذكي.",
          "بدل ما نكتب while لكل اتجاه، نسوي دالة وحدة تاخذ الاتجاه كمُدخل: <code>walk(\"right\")</code> و <code>walk(\"down\")</code>... والدالة تستخدم نفس المتغير dir مع <code>canMove(dir)</code> و <code>move(dir)</code>."
        ],
        sample: 'function walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n  }\n}\n\nwalk("up");   // يطلع لين الجدار',
        task: "استخدمي الدالة walk عشان يوصل الروبوت للعلم: يمين، تحت، يسار.",
        map: ["#######", "#R....#", "#####.#", "#G....#", "#######"],
        starter: 'function walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n  }\n}\n\nwalk("right");\n',
        hint: 'أضيفي <code>walk("down");</code> و <code>walk("left");</code>',
        solution: 'function walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n  }\n}\n\nwalk("right");\nwalk("down");\nwalk("left");\n',
        needs: [{ re: /\bfunction\s+\w+\s*\(\s*\w+/, msg: "استخدمي دالة تاخذ الاتجاه كمُدخل." }]
      },
      {
        title: "اجمعي كل الجواهر",
        lesson: [
          "الحين نخلي الدالة walk أذكى: وهي تمشي، تسأل في كل خانة إذا فيه جوهرة وتلتقطها.",
          "يعني if داخل while داخل function! كل وحدة داخل الثانية مثل الدمى الروسية."
        ],
        sample: "function walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n    // if هنا\n  }\n}",
        task: "اجمعي الجواهر التسع ووصلي للعلم.",
        map: ["#########", "#R*.*.*.#", "#######.#", "#.*.*.*.#", "#.#######", "#*.*.*.G#", "#########"],
        starter: "function walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n    // التقطي أي جوهرة في طريقك\n  }\n}\n\nwalk(\"right\");\n",
        hint: "داخل الحلقة تحت <code>move(dir);</code> اكتبي <code>if (gemHere()) { pick(); }</code>. وبعدين نادي walk بالترتيب: right, down, left, down, right.",
        solution: 'function walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n    if (gemHere()) {\n      pick();\n    }\n  }\n}\n\nwalk("right");\nwalk("down");\nwalk("left");\nwalk("down");\nwalk("right");\n',
        needs: [{ re: /\bfunction\s+\w+\s*\(|=>/, msg: "وصلتِ! بس التحدي يطلب دالة تاخذ اتجاه كمُدخل." }]
      },
      {
        title: "المهمة الكبرى",
        lesson: [
          "المهمة الأخيرة! هنا بتستخدمين كل شي: مصفوفة للطريق، حلقة for...of، دالة بمُدخل، while، if، ومتغير عدّاد.",
          "خذي وقتك، واقرئي الكود سطر سطر. لو علقتي، التلميح موجود."
        ],
        sample: "const route = [ ... ];\nlet total = 0;\n\nfunction walk(dir) { ... }\n\nfor (const d of route) {\n  walk(d);\n}\nsay(total);",
        task: "اجمعي الجواهر الثمان. خزني الاتجاهات في المصفوفة route، واحسبي الجواهر في المتغير total، وخلي الروبوت يقول المجموع في الأخير.",
        map: ["#########", "#R.*.*..#", "#######*#", "#.*..*..#", "#*#######", "#.*.*..G#", "#########"],
        starter: 'const route = ["right", "down"];\nlet total = 0;\n\nfunction walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n    if (gemHere()) {\n      pick();\n      // زيدي total\n    }\n  }\n}\n\nfor (const d of route) {\n  walk(d);\n}\n\n// قولي total\n',
        hint: 'الطريق كامل: <code>["right", "down", "left", "down", "right"]</code>. وداخل if أضيفي <code>total++;</code>، وفي الأخير <code>say(total);</code>',
        solution: 'const route = ["right", "down", "left", "down", "right"];\nlet total = 0;\n\nfunction walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n    if (gemHere()) {\n      pick();\n      total++;\n    }\n  }\n}\n\nfor (const d of route) {\n  walk(d);\n}\n\nsay(total);\n',
        needs: [
          { re: /\bfor\s*\(\s*(const|let|var)\s+\w+\s+of\b/, msg: "مري على المصفوفة route بـ for...of." },
          { re: /\bfunction\s+\w+\s*\(\s*\w+/, msg: "استخدمي دالة تاخذ الاتجاه كمُدخل." }
        ],
        check: (res, code) => {
          if (/say\s*\(\s*8\s*\)/.test(code)) return "لا تكتبين 8 بنفسك: say(total);";
          if (!res.says.includes("8")) return "الروبوت لازم يقول المجموع (8). زيدي total++ عند كل جوهرة.";
          return null;
        }
      }
    ]
  }
];

const LEVELS = [];
PLANETS.forEach((pl, pi) => {
  pl.first = LEVELS.length;
  pl.missions.forEach((m, mi) => LEVELS.push(Object.assign(m, { p: pi, m: mi, id: pi + "-" + mi })));
});
