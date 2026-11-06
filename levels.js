/* روبيكو: الكواكب والمهمات (الدروس، الخرائط، الحلول) */
const CONSOLE_MAP = ["#####", "#.R.#", "#####"];
const PLANETS = [
  {
    title: "أول أمر", concept: "الأوامر",
    missions: [{
      title: "أول أمر للروبوت",
      lesson: [
        "لا يفهم الروبوت كلامنا العادي. إنه يفهم <b>أوامر</b> مكتوبة بطريقة معينة، وتسمى هذه الطريقة <b>لغة برمجة</b>. سنستخدم لغة اسمها JavaScript.",
        "الأمر <code>right()</code> معناه: «امشِ خطوة واحدة إلى اليمين». القوسان <code>()</code> معناهما «نفّذ الآن»، والفاصلة المنقوطة <code>;</code> مثل النقطة في آخر الجملة.",
        "اكتبي الأمر، واضغطي زر <b>تشغيل</b>، وشاهدي ما يحدث. لن يتعطل شيء، فجرّبي كما تشائين."
      ],
      sample: "right();   // خطوة إلى اليمين",
      task: "أوصلي الروبوت إلى العلم.",
      map: ["######", "#R..G#", "######"],
      starter: "// اكتبي أوامرك هنا\nright();\n",
      hint: "يبعد العلم 3 خانات. اكتبي <code>right();</code> ثلاث مرات، كل أمر في سطر.",
      solution: "right();\nright();\nright();\n"
    }]
  },
  {
    title: "ترتيب الأوامر", concept: "التسلسل",
    missions: [{
      title: "الكود يُنفَّذ من الأعلى إلى الأسفل",
      lesson: [
        "يقرأ الحاسوب الكود كما نقرأ قائمة: من أول سطر إلى آخر سطر، سطرًا بعد سطر. وإذا غيّرتِ الترتيب تغيّر طريق الروبوت.",
        "لديكِ أربعة اتجاهات: <code>right()</code> يمين، <code>left()</code> يسار، <code>up()</code> أعلى، <code>down()</code> أسفل.",
        "النص الذي يأتي بعد <code>//</code> يسمى <b>تعليقًا</b>. يتجاهله الحاسوب، ونكتبه لنشرح الكود لأنفسنا."
      ],
      sample: "right();\ndown();   // ثم ينزل خانة\nleft();",
      task: "امشي في الممر حتى تصلي إلى العلم دون الاصطدام بجدار.",
      map: ["######", "#R..##", "###.##", "###.G#", "######"],
      starter: "right();\nright();\n",
      hint: "إلى اليمين مرتين، ثم إلى الأسفل مرتين، ثم إلى اليمين مرة واحدة.",
      solution: "right();\nright();\ndown();\ndown();\nright();\n"
    }]
  },
  {
    title: "حلقة for", concept: "التكرار",
    missions: [
      {
        title: "لماذا نكرر؟",
        lesson: [
          "تخيلي أنكِ تريدين أن يمشي الروبوت 6 خطوات. يمكنكِ كتابة <code>right();</code> ست مرات، لكن تخيلي لو كانت 100 خطوة!",
          "تقول الحلقة <b>loop</b> للحاسوب: «كرر هذا الكلام عددًا من المرات». وكل ما تكتبينه بين القوسين المعقوفين <code>{ }</code> يتكرر.",
          "لا تشغلي بالكِ الآن بما داخل القوس الأول، فسنشرحه في المهمة القادمة. ركزي فقط على الرقم: إنه عدد مرات التكرار."
        ],
        sample: "for (let i = 0; i < 3; i++) {\n  right();   // يتكرر هذا السطر 3 مرات\n}",
        task: "الطريق 6 خطوات. غيّري رقم التكرار ليصل الروبوت إلى العلم.",
        map: ["#########", "#R.....G#", "#########"],
        starter: "for (let i = 0; i < 2; i++) {\n  right();\n}\n",
        hint: "عدّي الخانات من الروبوت إلى العلم: 6. غيّري الرقم <code>2</code> إلى <code>6</code>.",
        solution: "for (let i = 0; i < 6; i++) {\n  right();\n}\n",
        needs: [{ re: /\bfor\s*\(/, msg: "وصلتِ! لكن هذه المهمة تطلب استخدام حلقة for." }]
      },
      {
        title: "العدّاد i",
        lesson: [
          "داخل قوس <code>for</code> ثلاثة أجزاء مفصولة بـ <code>;</code>، وكلها عن عدّاد اسمه <code>i</code>، كما تعدّين على أصابعكِ:",
          "<code>let i = 0</code> ابدئي العد من صفر.<br><code>i &lt; 4</code> تابعي ما دام العدد أقل من 4.<br><code>i++</code> بعد كل دورة زيدي العدد واحدًا.",
          "أي إن i يصبح 0 ثم 1 ثم 2 ثم 3، وعندما يصل إلى 4 يتوقف لأن 4 ليس أقل من 4. لذلك تتكرر الحلقة 4 مرات.",
          "الأمر <code>say()</code> يجعل الروبوت يقول أي شيء تضعينه بين القوسين. سنستخدمه لنرى قيمة العدّاد."
        ],
        sample: "for (let i = 0; i < 3; i++) {\n  say(i);   // يقول: 0 ثم 1 ثم 2\n}",
        task: "اجعلي الروبوت يمشي 4 خطوات، ويقول قيمة i بعد كل خطوة.",
        map: ["#######", "#R...G#", "#######"],
        starter: "for (let i = 0; i < 4; i++) {\n  right();\n  // اجعليه يقول قيمة i هنا\n}\n",
        hint: "تحت <code>right();</code> اكتبي <code>say(i);</code>",
        solution: "for (let i = 0; i < 4; i++) {\n  right();\n  say(i);\n}\n",
        needs: [{ re: /\bfor\s*\(/, msg: "استخدمي حلقة for." }],
        check: res => res.says.join(",") === "0,1,2,3" ? null : "يجب أن يقول الروبوت 0 ثم 1 ثم 2 ثم 3. ضعي say(i); داخل الحلقة تحت right();"
      },
      {
        title: "أكثر من أمر في الدورة",
        lesson: [
          "يمكنكِ وضع ما تشائين من الأوامر داخل <code>{ }</code>. وفي كل دورة تُنفَّذ كلها بالترتيب من الأعلى إلى الأسفل، ثم تبدأ الدورة التالية.",
          "انظري إلى الدرج: كل درجة هي «يمين ثم أسفل». أي إن الحركتين نفسيهما تتكرران عدة مرات."
        ],
        sample: "for (let i = 0; i < 2; i++) {\n  right();\n  up();\n}\n// يمين، أعلى، يمين، أعلى",
        task: "انزلي الدرج إلى العلم. كل درجة: خطوة إلى اليمين وخطوة إلى الأسفل.",
        map: ["#######", "#R.####", "##..###", "###..##", "####..#", "#####G#", "#######"],
        starter: "for (let i = 0; i < 4; i++) {\n  right();\n  // وماذا بعد ذلك؟\n}\n",
        hint: "تحت <code>right();</code> أضيفي <code>down();</code>",
        solution: "for (let i = 0; i < 4; i++) {\n  right();\n  down();\n}\n",
        needs: [{ re: /\bfor\s*\(/, msg: "وصلتِ! لكن جرّبي الحل بحلقة for." }]
      },
      {
        title: "حلقتان متتاليتان",
        lesson: [
          "يمكنكِ كتابة أكثر من حلقة. ينهي الحاسوب الحلقة الأولى كاملة، ثم يبدأ التي تليها.",
          "هذا مفيد عندما يكون في الطريق أكثر من اتجاه."
        ],
        sample: "for (let i = 0; i < 3; i++) {\n  right();\n}\nfor (let i = 0; i < 2; i++) {\n  down();\n}",
        task: "الطريق: 7 خطوات إلى اليمين، ثم 3 خطوات إلى الأسفل.",
        map: ["##########", "#R.......#", "########.#", "########.#", "########G#", "##########"],
        starter: "for (let i = 0; i < 7; i++) {\n  right();\n}\n\n// الحلقة الثانية هنا\n",
        hint: "انسخي الحلقة، والصقيها تحتها، وغيّري <code>right</code> إلى <code>down</code> والرقم إلى 3.",
        solution: "for (let i = 0; i < 7; i++) {\n  right();\n}\n\nfor (let i = 0; i < 3; i++) {\n  down();\n}\n",
        needs: [{ re: /\bfor\s*\([\s\S]*\bfor\s*\(/, msg: "وصلتِ! لكن المهمة تطلب حلقتي for." }]
      }
    ]
  },
  {
    title: "المتغيرات", concept: "تخزين القيم",
    missions: [
      {
        title: "ما هو الكونسول؟", mode: "console",
        lesson: [
          "يحتاج المبرمجون إلى رؤية ما يحدث داخل البرنامج. لذلك يوجد مكان اسمه <b>الكونسول console</b>، وهو مثل دفتر ملاحظات البرنامج: يكتب فيه رسائل لكِ.",
          "الأمر <code>console.log()</code> يكتب في الكونسول أي شيء تضعينه بين القوسين. كلمة log معناها «سجّل».",
          "في اللعبة، الكونسول هو صندوق <b>رسائل الروبوت</b>. وخارج اللعبة تجدينه في المتصفح عندما تضغطين F12.",
          "<b>مهم:</b> يجب أن يكون الكلام العادي (ويسمى نصًا string) بين علامتي تنصيص <code>\"...\"</code>. أما الأرقام فتُكتب دون تنصيص، ويحسبها الحاسوب لكِ."
        ],
        sample: 'console.log("مرحبًا");   // يطبع: مرحبًا\nconsole.log(5 + 3);      // يطبع: 8\nconsole.log("5 + 3");    // يطبع: 5 + 3 لأنه نص',
        task: "اطبعي في الكونسول جملة تختارينها، ثم اجعلي الحاسوب يحسب لكِ 12 + 30.",
        map: CONSOLE_MAP,
        starter: '// اطبعي جملتكِ هنا\nconsole.log("");\n\n// واحسبي 12 + 30\n',
        hint: "اكتبي جملتكِ بين علامتي التنصيص في السطر الأول. وتحتها: <code>console.log(12 + 30);</code> دون علامات تنصيص.",
        solution: 'console.log("أنا أتعلم جافا سكربت");\nconsole.log(12 + 30);\n',
        check: res => {
          if (!res.says.some(s => s.trim() && isNaN(s))) return "اطبعي جملة نصية بين علامتي تنصيص، ولا تتركيها فارغة.";
          if (res.says.includes("42")) return null;
          if (res.says.some(s => /12\s*\+\s*30/.test(s))) return "ظهر لكِ 12 + 30 كنص! احذفي علامات التنصيص ليحسبها الحاسوب.";
          return "لم يظهر الرقم 42. اكتبي console.log(12 + 30);";
        }
      },
      {
        title: "أول متغير", mode: "console",
        lesson: [
          "المتغير <b>variable</b> مثل صندوق عليه اسم. تضعين فيه قيمة، ثم تستخدمين الاسم بدلًا من كتابة القيمة في كل مرة.",
          "<code>let</code> معناها «أنشئ صندوقًا جديدًا». بعدها اسم الصندوق، ثم <code>=</code>، ثم القيمة.",
          "<b>انتبهي:</b> <code>=</code> في البرمجة معناها «ضعي داخل»، وليس «يساوي» كما في الرياضيات.",
          "عندما تكتبين اسم المتغير في <code>console.log</code> <b>دون</b> علامات تنصيص، يطبع ما بداخل الصندوق."
        ],
        sample: 'let robotName = "روبيكو";\nlet battery = 100;\n\nconsole.log(robotName);   // روبيكو\nconsole.log(battery);     // 100\nconsole.log("robotName"); // robotName لأنه نص عادي',
        task: "أنشئي متغيرًا اسمه <code>moons</code> فيه عدد أقمار المريخ (2)، واطبعيه تحت المتغير planet.",
        map: CONSOLE_MAP,
        starter: 'let planet = "المريخ";\n\n// أنشئي المتغير moons هنا\n\nconsole.log(planet);\n',
        hint: "أضيفي <code>let moons = 2;</code> وفي النهاية <code>console.log(moons);</code>",
        solution: 'let planet = "المريخ";\nlet moons = 2;\n\nconsole.log(planet);\nconsole.log(moons);\n',
        needs: [{ re: /\blet\s+moons\s*=/, msg: "أنشئي متغيرًا اسمه moons تحديدًا: let moons = 2;" }],
        check: (res, code) => {
          if (!/(console\.log|say)\s*\(\s*moons\s*\)/.test(code)) return "اطبعي المتغير باسمه دون علامات تنصيص: console.log(moons);";
          if (!res.says.includes("2")) return "يجب أن تكون قيمة moons هي 2.";
          return null;
        }
      },
      {
        title: "تغيير القيمة",
        lesson: [
          "يمكنكِ تغيير ما بداخل الصندوق الذي أنشأتِه بـ <code>let</code> في أي وقت. لا تكتبي <code>let</code> مرة ثانية، بل الاسم و<code>=</code> والقيمة الجديدة.",
          "<code>score = score + 1</code> تُقرأ: «خذي ما في score، وزيدي عليه 1، وأعيديه إلى score». مثل عدّاد النقاط في الألعاب.",
          "الأمر <code>pick()</code> يجعل الروبوت يلتقط الجوهرة التي تحته. و<code>say()</code> مثل <code>console.log()</code> تمامًا، لكن الروبوت يقولها."
        ],
        sample: "let score = 0;\nscore = score + 10;\nscore = score + 5;\nsay(score);   // 15",
        task: "اجمعي الجواهر الثلاث، وكلما التقطتِ واحدة زيدي العدّاد <code>gems</code> واحدًا. وفي النهاية اجعلي الروبوت يقول كم جمع.",
        map: ["#########", "#R*.*.*G#", "#########"],
        starter: "let gems = 0;\n\nright();\npick();\ngems = gems + 1;\n\nright();\nright();\n// أكملي...\n",
        hint: "كرري الشيء نفسه عند كل جوهرة: <code>pick();</code> ثم <code>gems = gems + 1;</code>. وبعد آخر <code>right();</code> اكتبي <code>say(gems);</code>",
        solution: "let gems = 0;\n\nright();\npick();\ngems = gems + 1;\n\nright();\nright();\npick();\ngems = gems + 1;\n\nright();\nright();\npick();\ngems = gems + 1;\n\nright();\nsay(gems);\n",
        check: (res, code) => {
          if (!/gems\s*(=\s*gems\s*\+|\+\+|\+=)/.test(code)) return "زيدي العدّاد بنفسكِ: gems = gems + 1;";
          if (/say\s*\(\s*3\s*\)/.test(code)) return "لا تكتبي 3 بنفسكِ، بل اجعلي الروبوت يقول المتغير: say(gems);";
          if (!res.says.includes("3")) return "يجب أن يقول الروبوت قيمة gems في النهاية: say(gems);";
          return null;
        }
      },
      {
        title: "const والحساب",
        lesson: [
          "هناك نوعان من الصناديق: <code>let</code> لقيمة يمكن أن تتغير، و<code>const</code> لقيمة ثابتة لا تتغير أبدًا. وإذا حاولتِ تغيير const يظهر لكِ خطأ.",
          "يمكنكِ الحساب بالمتغيرات: <code>+</code> جمع، <code>-</code> طرح، <code>*</code> ضرب، <code>/</code> قسمة.",
          "ويمكنكِ وضع المتغير داخل الحلقة بدلًا من الرقم. وإذا غيّرتِ قيمته مرة واحدة في الأعلى، تغيّر في كل مكان يُستخدم فيه."
        ],
        sample: "const steps = 3;\nsay(steps * 2);    // 6\nsay(steps + 10);   // 13\n\nfor (let i = 0; i < steps; i++) {\n  right();\n}",
        task: "استخدمي المتغير steps لينزل الروبوت ثم يتجه إلى اليمين. وفي النهاية اجعليه يقول عدد الخطوات كلها (8) دون أن تكتبي الرقم 8 بنفسكِ.",
        map: ["#######", "#R#####", "#.#####", "#.#####", "#.#####", "#....G#", "#######"],
        starter: "const steps = 4;\n\nfor (let i = 0; i < steps; i++) {\n  down();\n}\n\n// أكملي: تحركي إلى اليمين بالعدد نفسه\n",
        hint: "انسخي الحلقة وغيّري <code>down()</code> إلى <code>right()</code>. ثم اكتبي <code>say(steps * 2);</code>",
        solution: "const steps = 4;\n\nfor (let i = 0; i < steps; i++) {\n  down();\n}\n\nfor (let i = 0; i < steps; i++) {\n  right();\n}\n\nsay(steps * 2);\n",
        needs: [
          { re: /\b(let|const|var)\s+\w+/, msg: "تطلب المهمة تعريف متغير بـ let أو const." },
          { re: /\bsay\s*\(|console\.log\s*\(/, msg: "وصلتِ! بقي أن تجعلي الروبوت يقول عدد الخطوات باستخدام say()." }
        ],
        check: (res, code) => {
          if (/say\s*\(\s*8\s*\)/.test(code)) return "جيد، لكن احسبيها من المتغير بدلًا من كتابة 8: say(steps * 2);";
          if (!res.says.some(s => /(^|\D)8(\D|$)/.test(s))) return "لم يقل الروبوت الرقم 8. استخدمي say(steps * 2);";
          return null;
        }
      }
    ]
  },
  {
    title: "الشرط if", concept: "اتخاذ القرار",
    missions: [
      {
        title: "صحيح أم خطأ", mode: "console",
        lesson: [
          "يوجد في البرمجة نوع خاص من القيم اسمه <b>boolean</b>، وله قيمتان فقط: <code>true</code> تعني صحيح، و<code>false</code> تعني خطأ.",
          "عندما تسألين الحاسوب سؤال مقارنة، يجيبكِ بـ true أو false.",
          "<code>&gt;</code> أكبر من، <code>&lt;</code> أصغر من، <code>===</code> يساوي. انتبهي: تكون المقارنة بثلاث علامات <code>===</code>، لأن العلامة الواحدة <code>=</code> معناها «ضعي داخل»."
        ],
        sample: "say(10 > 3);     // true\nsay(2 > 8);      // false\nsay(5 === 5);    // true",
        task: "اجعلي الروبوت يسأل: هل 7 أكبر من 4؟ ثم: هل 9 يساوي 6؟",
        map: CONSOLE_MAP,
        starter: "// هل 7 أكبر من 4؟\nsay();\n\n// هل 9 يساوي 6؟\n",
        hint: "<code>say(7 > 4);</code> وتحتها <code>say(9 === 6);</code>",
        solution: "say(7 > 4);\nsay(9 === 6);\n",
        check: (res, code) => {
          if (/say\s*\(\s*(true|false)\s*\)/.test(code)) return "لا تكتبي true أو false بنفسكِ! اجعلي الحاسوب يقارن: say(7 > 4);";
          if (res.says.filter(Boolean).join(",") !== "true,false") return "يجب أن يقول الروبوت true ثم false. استخدمي > و===";
          return null;
        }
      },
      {
        title: "أول if",
        lesson: [
          "<code>if</code> معناها «إذا». تعطينها سؤالًا بين قوسين <code>( )</code>. فإذا كان الجواب <code>true</code> نفّذت الكود الذي بين <code>{ }</code>، وإذا كان <code>false</code> تخطته.",
          "<code>gemHere()</code> سؤال جاهز معناه «هل توجد جوهرة تحتي؟»، ويعيد true أو false.",
          "لماذا نحتاج إليه؟ لأن <code>pick()</code> دون وجود جوهرة تحت الروبوت يُظهر خطأ. لذلك نسأل قبل الالتقاط."
        ],
        sample: "if (gemHere()) {\n  pick();   // لا يُنفَّذ إلا إذا وُجدت جوهرة\n}",
        task: "امشي خطوة، وإذا وُجدت جوهرة فالتقطيها، ثم تابعي إلى العلم.",
        map: ["######", "#R*.G#", "######"],
        starter: "right();\n\n// اسألي: هل توجد جوهرة؟\n\nright();\nright();\n",
        hint: "بعد أول <code>right();</code> اكتبي:<br><code>if (gemHere()) {</code><br><code>&nbsp;&nbsp;pick();</code><br><code>}</code>",
        solution: "right();\n\nif (gemHere()) {\n  pick();\n}\n\nright();\nright();\n",
        needs: [{ re: /\bif\s*\(/, msg: "صحيح، لكن المهمة تطلب استخدام if قبل pick()." }]
      },
      {
        title: "if داخل حلقة",
        lesson: [
          "عندما تضعين if داخل حلقة، يُطرح السؤال في <b>كل دورة</b> من جديد. فيتصرف الروبوت بحسب الخانة التي هو فيها.",
          "بهذه الطريقة لا تحتاجين إلى معرفة مكان الجواهر تحديدًا، فالروبوت يقرر بنفسه."
        ],
        sample: "for (let i = 0; i < 5; i++) {\n  right();\n  if (gemHere()) {\n    pick();\n  }\n}",
        task: "اجمعي كل الجواهر في الممر ثم صلي إلى العلم.",
        map: ["###########", "#R.*.**.*G#", "###########"],
        starter: "for (let i = 0; i < 8; i++) {\n  right();\n  // اكتبي الشرط هنا\n}\n",
        hint: "داخل الحلقة بعد <code>right();</code> اكتبي: <code>if (gemHere()) { pick(); }</code>",
        solution: "for (let i = 0; i < 8; i++) {\n  right();\n  if (gemHere()) {\n    pick();\n  }\n}\n",
        needs: [{ re: /\bif\s*\(/, msg: "استخدمي if لتقرري متى تلتقطين الجوهرة." }]
      },
      {
        title: "وإلا else",
        lesson: [
          "<code>else</code> معناها «وإلا». يُنفَّذ الكود الذي بعدها عندما يكون جواب if هو <code>false</code>.",
          "أي إن أحدهما يُنفَّذ دائمًا: إما ما في if أو ما في else، ولا يُنفَّذان معًا أبدًا."
        ],
        sample: 'if (gemHere()) {\n  pick();\n} else {\n  say("فارغة");\n}',
        task: 'امشي إلى العلم. في كل خانة: إذا وُجدت جوهرة فالتقطيها، وإلا فاجعلي الروبوت يقول "فارغة".',
        map: ["#########", "#R.*..*G#", "#########"],
        starter: "for (let i = 0; i < 6; i++) {\n  right();\n  if (gemHere()) {\n    pick();\n  }\n  // أضيفي else بعد القوس } مباشرة\n}\n",
        hint: 'غيّري القوس <code>}</code> الذي بعد pick إلى:<br><code>} else {</code><br><code>&nbsp;&nbsp;say("فارغة");</code><br><code>}</code>',
        solution: 'for (let i = 0; i < 6; i++) {\n  right();\n  if (gemHere()) {\n    pick();\n  } else {\n    say("فارغة");\n  }\n}\n',
        needs: [{ re: /\belse\b/, msg: "تطلب المهمة استخدام else." }],
        check: res => {
          const n = res.says.length;
          return n === 4 ? null : `تكلم الروبوت ${n} مرات، والمفترض 4 (عدد الخانات الفارغة). تأكدي أن say داخل else فقط.`;
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
          "قبل أن نتعلم حلقة جديدة، نتعرف على سؤال جديد: <code>canMove(\"right\")</code> يعني «هل أستطيع المشي إلى اليمين؟». يعيد <code>true</code> إذا كان الطريق مفتوحًا، و<code>false</code> إذا كان هناك جدار.",
          "يُكتب الاتجاه كنص بين علامتي تنصيص: <code>\"right\"</code> و<code>\"left\"</code> و<code>\"up\"</code> و<code>\"down\"</code>."
        ],
        sample: 'say(canMove("down"));   // true أو false',
        task: "الروبوت في غرفة صغيرة. اجعليه يقول: هل يستطيع المشي إلى اليمين؟ ثم: هل يستطيع المشي إلى الأعلى؟",
        map: ["####", "#R.#", "####"],
        starter: 'say(canMove("right"));\n\n// واسألي عن الأعلى\n',
        hint: 'اكتبي <code>say(canMove("up"));</code>',
        solution: 'say(canMove("right"));\nsay(canMove("up"));\n',
        needs: [{ re: /canMove\s*\(\s*["']up["']\s*\)/, msg: 'اسألي عن الأعلى: canMove("up")' }],
        check: res => res.says.join(",") === "true,false" ? null : "يجب أن يقول الروبوت true (اليمين مفتوح) ثم false (في الأعلى جدار)."
      },
      {
        title: "كرري ما دام",
        lesson: [
          "نستخدم <code>for</code> عندما نعرف عدد المرات بالضبط. لكننا أحيانًا لا نعرفه! مثلًا: «امشي حتى تصلي إلى الجدار».",
          "هنا نستخدم <code>while</code> ومعناها «ما دام». تطرح السؤال: فإذا كان الجواب true نفّذت ما بداخلها، ثم تعود لتسأل من جديد. وتتوقف عندما يصبح الجواب false.",
          "<b>انتبهي:</b> إذا ظل جواب السؤال true إلى الأبد، فلن تتوقف الحلقة أبدًا! وتسمى هذه <b>حلقة لا نهائية</b>، وستوقفها اللعبة لكِ وتنبهكِ."
        ],
        sample: 'while (canMove("right")) {\n  right();\n}\n// يمشي إلى اليمين حتى يصل إلى الجدار',
        task: "لا نعرف طول الممر! اجعلي الروبوت يمشي إلى اليمين حتى الجدار باستخدام while.",
        map: ["############", "#R........G#", "############"],
        starter: 'while (canMove("")) {\n  right();\n}\n',
        hint: 'ضعي <code>"right"</code> بين علامتي التنصيص داخل canMove.',
        solution: 'while (canMove("right")) {\n  right();\n}\n',
        needs: [{ re: /\bwhile\s*\(/, msg: "وصلتِ! لكن جرّبي الحل باستخدام while." }]
      },
      {
        title: "اتجاهات كثيرة",
        lesson: [
          "يمكنكِ كتابة أكثر من while متتالية. تمشي كل واحدة في اتجاه حتى الجدار، ثم تبدأ التي تليها.",
          "والجميل هنا أنكِ لا تحتاجين إلى عدّ الخانات أبدًا."
        ],
        sample: 'while (canMove("up")) {\n  up();\n}\nwhile (canMove("left")) {\n  left();\n}',
        task: "صلي إلى العلم: إلى اليمين حتى الجدار، ثم إلى الأسفل حتى الجدار، ثم إلى اليسار حتى الجدار.",
        map: ["########", "#R....##", "#####.##", "#####.##", "#G....##", "########"],
        starter: 'while (canMove("right")) {\n  right();\n}\n',
        hint: 'أضيفي حلقة while ثانية بالاتجاه <code>"down"</code>، وثالثة بالاتجاه <code>"left"</code>.',
        solution: 'while (canMove("right")) {\n  right();\n}\n\nwhile (canMove("down")) {\n  down();\n}\n\nwhile (canMove("left")) {\n  left();\n}\n',
        needs: [{ re: /\bwhile\s*\(/, msg: "وصلتِ! لكن جرّبي الحل باستخدام while بدلًا من العد." }]
      },
      {
        title: "عدّاد مع while",
        lesson: [
          "ليس في while عدّاد جاهز مثل for. لكن يمكنكِ إنشاء عدّاد بنفسكِ بمتغير!",
          "<code>steps++</code> اختصار لـ <code>steps = steps + 1</code>."
        ],
        sample: "let count = 0;\ncount++;\ncount++;\nsay(count);   // 2",
        task: "امشي حتى الجدار، واحسبي عدد خطواتكِ، واجعلي الروبوت يقوله في النهاية.",
        map: ["##########", "#R......G#", "##########"],
        starter: 'let steps = 0;\n\nwhile (canMove("right")) {\n  right();\n  // زيدي العدّاد هنا\n}\n\n// اجعلي الروبوت يقول steps\n',
        hint: "داخل الحلقة تحت <code>right();</code> اكتبي <code>steps++;</code>. وبعد الحلقة: <code>say(steps);</code>",
        solution: 'let steps = 0;\n\nwhile (canMove("right")) {\n  right();\n  steps++;\n}\n\nsay(steps);\n',
        needs: [{ re: /\bwhile\s*\(/, msg: "استخدمي while." }],
        check: (res, code) => {
          if (/say\s*\(\s*7\s*\)/.test(code)) return "لا تكتبي الرقم بنفسكِ، بل اجعلي العدّاد يحسب: say(steps);";
          if (!res.says.includes("7")) return "يجب أن يقول الروبوت عدد الخطوات (7). زيدي steps++ داخل الحلقة، وقولي say(steps) بعدها.";
          return null;
        }
      }
    ]
  },
  {
    title: "دوالكِ الخاصة", concept: "الدوال",
    missions: [
      {
        title: "ما هي الدالة؟", mode: "console",
        lesson: [
          "هل تتذكرين <code>right()</code> و<code>say()</code>؟ هذه كلها <b>دوال functions</b>. الدالة مجموعة أوامر لها اسم، وعندما تستدعينها باسمها تُنفَّذ كل الأوامر التي فيها.",
          "إنها مثل وصفة الكعك: تكتبينها مرة واحدة في الدفتر، وكلما أردتِ كعكًا عدتِ إليها بدلًا من كتابة الخطوات من جديد.",
          "تنشئين الدالة بكلمة <code>function</code>، ثم الاسم، ثم <code>()</code>، ثم الأوامر بين <code>{ }</code>. يسمى هذا <b>تعريف</b> الدالة، ولا يُنفَّذ شيء وحده! بل يجب أن <b>تستدعيها</b> باسمها: <code>hello();</code>"
        ],
        sample: 'function hello() {\n  say("أهلًا وسهلًا!");\n}\n\nhello();   // استدعينا الدالة\nhello();   // واستدعيناها مرة ثانية',
        task: 'أنشئي دالة اسمها <code>cheer</code> تجعل الروبوت يقول "هيا نبرمج!"، واستدعيها 3 مرات.',
        map: CONSOLE_MAP,
        starter: "function cheer() {\n  // اكتبي هنا\n}\n\n// استدعي الدالة 3 مرات\n",
        hint: 'داخل الدالة: <code>say("هيا نبرمج!");</code>. وتحت الدالة اكتبي <code>cheer();</code> ثلاث مرات.',
        solution: 'function cheer() {\n  say("هيا نبرمج!");\n}\n\ncheer();\ncheer();\ncheer();\n',
        needs: [{ re: /\bfunction\s+cheer\s*\(/, msg: "عرّفي دالة اسمها cheer: function cheer() { ... }" }],
        check: (res, code) => {
          if ((code.match(/\bcheer\s*\(\s*\)/g) || []).length < 4) return "استدعي الدالة ثلاث مرات: cheer();";
          if (res.says.length < 3) return "لم يتكلم الروبوت. ضعي say داخل الدالة.";
          return null;
        }
      },
      {
        title: "دالة تحرك الروبوت",
        lesson: [
          "يمكن أن تحتوي الدالة على أوامر حركة. وعندما ترين الحركات نفسها تتكرر، ضعيها في دالة وأعطيها اسمًا واضحًا.",
          "ويمكنكِ استدعاء الدالة داخل حلقة! وبهذا يصبح الكود قصيرًا وسهل القراءة."
        ],
        sample: "function zigzag() {\n  up();\n  right();\n}\n\nfor (let i = 0; i < 3; i++) {\n  zigzag();\n}",
        task: "اصعدي الدرج إلى العلم. استخدمي الدالة climb داخل حلقة.",
        map: ["########", "#####.G#", "####..##", "###..###", "##..####", "#R.#####", "########"],
        starter: "function climb() {\n  right();\n  up();\n}\n\nclimb();\n",
        hint: "في الدرج 4 درجات، ثم خطوة أخيرة إلى اليمين. ضعي <code>climb();</code> داخل حلقة for تتكرر 4 مرات.",
        solution: "function climb() {\n  right();\n  up();\n}\n\nfor (let i = 0; i < 4; i++) {\n  climb();\n}\nright();\n",
        needs: [{ re: /\bfunction\s+\w+\s*\(/, msg: "تطلب المهمة دالة باستخدام function." }]
      },
      {
        title: "مُدخلات الدالة",
        lesson: [
          "أحيانًا نريد أن تعمل الدالة بطريقة مختلفة في كل مرة. مثلًا «امشي إلى اليمين»، لكن مرة خطوتين ومرة 4 خطوات.",
          "نضع بين قوسي الدالة اسمًا مثل <code>steps</code>. يسمى هذا <b>مُدخلًا parameter</b>، وهو متغير تأتي قيمته ممن يستدعي الدالة.",
          "عندما تكتبين <code>walkRight(3)</code>، ينتقل الرقم 3 ويوضع داخل <code>steps</code>."
        ],
        sample: 'function greet(name) {\n  say("مرحبًا " + name);\n}\n\ngreet("سارة");   // مرحبًا سارة\ngreet("نورة");   // مرحبًا نورة',
        task: "استخدمي الدالة <code>walkRight</code> لتصلي إلى العلم: يمين 2، أسفل 2، يمين 4.",
        map: ["#########", "#R..#####", "###.#####", "###....G#", "#########"],
        starter: "function walkRight(steps) {\n  for (let i = 0; i < steps; i++) {\n    right();\n  }\n}\n\nwalkRight(2);\n",
        hint: "بعد <code>walkRight(2);</code> انزلي خطوتين بـ <code>down();</code> ثم <code>walkRight(4);</code>",
        solution: "function walkRight(steps) {\n  for (let i = 0; i < steps; i++) {\n    right();\n  }\n}\n\nwalkRight(2);\ndown();\ndown();\nwalkRight(4);\n",
        needs: [{ re: /\bfunction\s+\w+\s*\(\s*\w+/, msg: "استخدمي دالة فيها مُدخل مثل walkRight(steps)." }]
      },
      {
        title: "return: الدالة تعيد جوابًا", mode: "console",
        lesson: [
          "بعض الدوال <b>تنفذ</b> شيئًا (مثل right تحرك الروبوت). وبعضها <b>يعيد جوابًا</b>، مثل gemHere() تعيد true أو false.",
          "كلمة <code>return</code> معناها «هذا جوابي». تتوقف الدالة عندها وتعيد القيمة إلى من استدعاها.",
          "إنها مثل الآلة الحاسبة: تعطينها أرقامًا، فتعيد إليكِ النتيجة."
        ],
        sample: "function double(x) {\n  return x * 2;\n}\n\nsay(double(5));    // 10\nsay(double(21));   // 42",
        task: "أكملي الدالة <code>add</code> لتعيد مجموع الرقمين a وb. سيقول الروبوت add(7, 5) ويجب أن تظهر النتيجة 12.",
        map: CONSOLE_MAP,
        starter: "function add(a, b) {\n  // أعيدي مجموع a وb\n}\n\nsay(add(7, 5));\n",
        hint: "داخل الدالة اكتبي <code>return a + b;</code>",
        solution: "function add(a, b) {\n  return a + b;\n}\n\nsay(add(7, 5));\n",
        check: (res, code) => {
          if (res.says.includes("undefined")) return "أعادت الدالة undefined، أي «لا يوجد جواب». ينقصكِ return.";
          if (/return\s+12\b/.test(code)) return "اجعلي الدالة تحسبها بنفسها: return a + b;";
          if (!res.says.includes("12")) return "يجب أن يكون الجواب 12. تأكدي أنكِ كتبتِ return a + b;";
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
        title: "ما هي المصفوفة؟", mode: "console",
        lesson: [
          "المصفوفة <b>array</b> مثل قائمة المشتريات: متغير واحد فيه أكثر من قيمة بالترتيب. تكتبينها بين قوسين مربعين <code>[ ]</code> وتفصلين العناصر بفواصل.",
          "لكل عنصر رقم مكان يسمى <b>index</b>. وانتبهي: يبدأ العد من <b>الصفر</b> وليس من الواحد! <code>list[0]</code> أول عنصر، و<code>list[1]</code> الثاني.",
          "<code>list.length</code> يعطيكِ عدد العناصر."
        ],
        sample: 'const fruits = ["تفاح", "موز", "عنب"];\n\nsay(fruits[0]);       // تفاح\nsay(fruits[2]);       // عنب\nsay(fruits.length);   // 3',
        task: "أضيفي إلى المصفوفة <code>planets</code> اسمين لتصبح 4 كواكب. واجعلي الروبوت يقول أول كوكب، ثم عدد الكواكب.",
        map: CONSOLE_MAP,
        starter: 'const planets = ["عطارد", "الزهرة"];\n\n// قولي أول عنصر\n\n// قولي عدد العناصر\n',
        hint: 'أضيفي اسمين: <code>["عطارد", "الزهرة", "الأرض", "المريخ"]</code>. ثم <code>say(planets[0]);</code> و<code>say(planets.length);</code>',
        solution: 'const planets = ["عطارد", "الزهرة", "الأرض", "المريخ"];\n\nsay(planets[0]);\nsay(planets.length);\n',
        check: (res, code) => {
          if (!/planets\s*\[\s*0\s*\]/.test(code)) return "قولي أول عنصر بـ planets[0]";
          if (!/planets\.length/.test(code)) return "قولي عدد العناصر بـ planets.length";
          if (!res.says.includes("4")) return "يجب أن تحتوي المصفوفة على 4 عناصر.";
          return null;
        }
      },
      {
        title: "المرور على العناصر",
        lesson: [
          "<code>for...of</code> حلقة خاصة بالمصفوفات: تمر على العناصر واحدًا واحدًا بالترتيب، وفي كل دورة تضع العنصر في متغير.",
          "<code>for (const dir of path)</code> تُقرأ: «لكل dir موجود في path، نفّذ ما يلي».",
          "و<code>move(dir)</code> يحرك الروبوت في الاتجاه المكتوب في dir."
        ],
        sample: 'const colors = ["أحمر", "أزرق", "أخضر"];\n\nfor (const c of colors) {\n  say(c);\n}\n// أحمر، ثم أزرق، ثم أخضر',
        task: "تحتوي المصفوفة path على خطوات الطريق. أكملي الخطوات الناقصة ليصل الروبوت.",
        map: ["#####", "#R.##", "##.G#", "#####"],
        starter: 'const path = ["right"];\n\nfor (const dir of path) {\n  move(dir);\n}\n',
        hint: 'الطريق: يمين، أسفل، يمين. أي <code>["right", "down", "right"]</code>',
        solution: 'const path = ["right", "down", "right"];\n\nfor (const dir of path) {\n  move(dir);\n}\n',
        needs: [{ re: /\bfor\s*\(\s*(const|let|var)\s+\w+\s+of\b/, msg: "مرّي على المصفوفة باستخدام for...of." }]
      },
      {
        title: "مسار طويل",
        lesson: [
          "يمكن أن تكون المصفوفة طويلة. وإذا أردتِ كتابتها على أكثر من سطر لتكون أوضح، فلا مشكلة.",
          "لا تتغير الحلقة نفسها مهما طالت المصفوفة. وهذه قوة المصفوفات!"
        ],
        sample: 'const path = [\n  "right", "right",\n  "down", "down"\n];',
        task: "أكملي المصفوفة path بكل الاتجاهات التي توصل الروبوت إلى العلم.",
        map: ["#######", "#R..###", "###.###", "###...#", "#####.#", "#G....#", "#######"],
        starter: 'const path = ["right", "right", "down", "down"];\n\nfor (const dir of path) {\n  move(dir);\n}\n',
        hint: 'بعد الأربعة الأولى: يمين مرتين، أسفل مرتين، ثم يسار أربع مرات. أضيفيها كنصوص مثل <code>"left"</code>.',
        solution: 'const path = [\n  "right", "right", "down", "down",\n  "right", "right", "down", "down",\n  "left", "left", "left", "left"\n];\n\nfor (const dir of path) {\n  move(dir);\n}\n',
        needs: [
          { re: /\[/, msg: "استخدمي مصفوفة [ ] للاتجاهات." },
          { re: /\bfor\s*\(\s*(const|let|var)\s+\w+\s+of\b/, msg: "مرّي على المصفوفة باستخدام for...of." }
        ]
      },
      {
        title: "إضافة عنصر push",
        lesson: [
          "يمكنكِ إضافة عنصر جديد في آخر المصفوفة بـ <code>push()</code>.",
          "حتى لو كانت المصفوفة <code>const</code> يمكنكِ الإضافة إليها، لأن الصندوق نفسه لم يتغير، بل وضعتِ فيه أشياء أكثر.",
          "مثلًا نبدأ بمصفوفة فارغة <code>[]</code> ونملؤها ونحن نمشي."
        ],
        sample: 'const bag = [];\nbag.push("مفتاح");\nbag.push("خريطة");\n\nsay(bag.length);   // 2',
        task: 'كلما التقطتِ جوهرة، أضيفي "💎" إلى المصفوفة bag. وفي النهاية اجعلي الروبوت يقول كم جوهرة في الحقيبة.',
        map: ["##########", "#R*.**.*G#", "##########"],
        starter: 'const bag = [];\n\nfor (let i = 0; i < 7; i++) {\n  right();\n  if (gemHere()) {\n    pick();\n    // أضيفي إلى الحقيبة هنا\n  }\n}\n\n// قولي كم عنصرًا في bag\n',
        hint: 'تحت <code>pick();</code> اكتبي <code>bag.push("💎");</code>. وبعد الحلقة: <code>say(bag.length);</code>',
        solution: 'const bag = [];\n\nfor (let i = 0; i < 7; i++) {\n  right();\n  if (gemHere()) {\n    pick();\n    bag.push("💎");\n  }\n}\n\nsay(bag.length);\n',
        needs: [{ re: /\.push\s*\(/, msg: "أضيفي الجواهر إلى المصفوفة بـ bag.push()." }],
        check: (res, code) => {
          if (/say\s*\(\s*4\s*\)/.test(code)) return "لا تكتبي 4 بنفسكِ: say(bag.length);";
          if (!res.says.includes("4")) return "يجب أن يقول الروبوت عدد العناصر في bag: say(bag.length);";
          return null;
        }
      }
    ]
  },
  {
    title: "التحدي الأخير", concept: "كل شيء معًا",
    missions: [
      {
        title: "دالة تأخذ اتجاهًا",
        lesson: [
          "هذا كوكب المراجعة. سنجمع كل ما تعلمتِه في كود قصير وذكي.",
          "بدلًا من كتابة while لكل اتجاه، ننشئ دالة واحدة تأخذ الاتجاه كمُدخل: <code>walk(\"right\")</code> و<code>walk(\"down\")</code>. وتستخدم الدالة المتغير نفسه dir مع <code>canMove(dir)</code> و<code>move(dir)</code>."
        ],
        sample: 'function walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n  }\n}\n\nwalk("up");   // يصعد حتى الجدار',
        task: "استخدمي الدالة walk ليصل الروبوت إلى العلم: يمين، أسفل، يسار.",
        map: ["#######", "#R....#", "#####.#", "#G....#", "#######"],
        starter: 'function walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n  }\n}\n\nwalk("right");\n',
        hint: 'أضيفي <code>walk("down");</code> و<code>walk("left");</code>',
        solution: 'function walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n  }\n}\n\nwalk("right");\nwalk("down");\nwalk("left");\n',
        needs: [{ re: /\bfunction\s+\w+\s*\(\s*\w+/, msg: "استخدمي دالة تأخذ الاتجاه كمُدخل." }]
      },
      {
        title: "اجمعي كل الجواهر",
        lesson: [
          "الآن نجعل الدالة walk أذكى: وهي تمشي، تسأل في كل خانة إن كانت فيها جوهرة وتلتقطها.",
          "أي if داخل while داخل function! كل واحدة داخل الأخرى مثل الدمى الروسية."
        ],
        sample: "function walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n    // if هنا\n  }\n}",
        task: "اجمعي الجواهر التسع وصلي إلى العلم.",
        map: ["#########", "#R*.*.*.#", "#######.#", "#.*.*.*.#", "#.#######", "#*.*.*.G#", "#########"],
        starter: "function walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n    // التقطي أي جوهرة في طريقكِ\n  }\n}\n\nwalk(\"right\");\n",
        hint: "داخل الحلقة تحت <code>move(dir);</code> اكتبي <code>if (gemHere()) { pick(); }</code>. ثم استدعي walk بالترتيب: right, down, left, down, right.",
        solution: 'function walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n    if (gemHere()) {\n      pick();\n    }\n  }\n}\n\nwalk("right");\nwalk("down");\nwalk("left");\nwalk("down");\nwalk("right");\n',
        needs: [{ re: /\bfunction\s+\w+\s*\(|=>/, msg: "وصلتِ! لكن التحدي يطلب دالة تأخذ اتجاهًا كمُدخل." }]
      },
      {
        title: "المهمة الكبرى",
        lesson: [
          "المهمة الأخيرة! ستستخدمين هنا كل شيء: مصفوفة للطريق، وحلقة for...of، ودالة بمُدخل، وwhile، وif، ومتغيرًا عدّادًا.",
          "خذي وقتكِ، واقرئي الكود سطرًا سطرًا. وإذا واجهتكِ صعوبة، فالتلميح موجود."
        ],
        sample: "const route = [ ... ];\nlet total = 0;\n\nfunction walk(dir) { ... }\n\nfor (const d of route) {\n  walk(d);\n}\nsay(total);",
        task: "اجمعي الجواهر الثماني. خزّني الاتجاهات في المصفوفة route، واحسبي الجواهر في المتغير total، واجعلي الروبوت يقول المجموع في النهاية.",
        map: ["#########", "#R.*.*..#", "#######*#", "#.*..*..#", "#*#######", "#.*.*..G#", "#########"],
        starter: 'const route = ["right", "down"];\nlet total = 0;\n\nfunction walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n    if (gemHere()) {\n      pick();\n      // زيدي total\n    }\n  }\n}\n\nfor (const d of route) {\n  walk(d);\n}\n\n// قولي total\n',
        hint: 'الطريق كاملًا: <code>["right", "down", "left", "down", "right"]</code>. وداخل if أضيفي <code>total++;</code>، وفي النهاية <code>say(total);</code>',
        solution: 'const route = ["right", "down", "left", "down", "right"];\nlet total = 0;\n\nfunction walk(dir) {\n  while (canMove(dir)) {\n    move(dir);\n    if (gemHere()) {\n      pick();\n      total++;\n    }\n  }\n}\n\nfor (const d of route) {\n  walk(d);\n}\n\nsay(total);\n',
        needs: [
          { re: /\bfor\s*\(\s*(const|let|var)\s+\w+\s+of\b/, msg: "مرّي على المصفوفة route بـ for...of." },
          { re: /\bfunction\s+\w+\s*\(\s*\w+/, msg: "استخدمي دالة تأخذ الاتجاه كمُدخل." }
        ],
        check: (res, code) => {
          if (/say\s*\(\s*8\s*\)/.test(code)) return "لا تكتبي 8 بنفسكِ: say(total);";
          if (!res.says.includes("8")) return "يجب أن يقول الروبوت المجموع (8). زيدي total++ عند كل جوهرة.";
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
