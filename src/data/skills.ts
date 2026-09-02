/**
 * قدرات الموظفين: كل قدرة نموذج قصير يملأه المستخدم، فيخرج الموظف بمخرج جاهز للاستخدام.
 * نبدأ بالموظفين الأسهل (مخرجات نصية بحتة) ثم نضيف الأصعب تدريجياً.
 */

export type SkillField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  defaultValue?: string;
};

export type Skill = {
  id: string;
  employeeId: string;
  title: string;
  summary: string;
  kind: string;
  channel: string;
  fields: SkillField[];
  /** تعليمات دقيقة تُرسل للموظف مع قيم النموذج */
  buildPrompt: (v: Record<string, string>) => string;
};

const tone: SkillField = {
  name: "tone",
  label: "النبرة",
  type: "select",
  options: ["احترافية", "ودودة", "تحفيزية", "خبيرة وهادئة"],
  defaultValue: "احترافية",
};

export const skills: Skill[] = [
  // ————— نور: المحتوى والسيو (الأسهل: مخرجات نصية بحتة) —————
  {
    id: "keyword-research",
    employeeId: "nour",
    title: "بحث كلمات مفتاحية",
    summary: "قائمة كلمات عربية مرتّبة حسب النية والصعوبة مع أفكار عناوين.",
    kind: "بحث كلمات",
    channel: "seo",
    fields: [
      {
        name: "topic",
        label: "الموضوع أو المنتج",
        type: "text",
        placeholder: "مثال: تمور فاخرة للشركات",
        required: true,
      },
      {
        name: "market",
        label: "السوق المستهدف",
        type: "text",
        placeholder: "السعودية / الخليج / مصر",
        defaultValue: "السعودية",
      },
      { name: "count", label: "عدد الكلمات", type: "number", defaultValue: "20" },
    ],
    buildPrompt: (v) =>
      [
        `أنجز بحث كلمات مفتاحية عربية لموضوع: «${v['topic']}» في سوق ${v['market'] || "السعودية"}.`,
        `أعطني ${v['count'] || 20} كلمة/عبارة مرتّبة في جدول Markdown بالأعمدة:`,
        "| الكلمة | نية البحث | حجم تقديري | صعوبة تقديرية | عنوان مقال مقترح |",
        "اجعل الكلمات باللهجة والاستخدام الحقيقي للسوق (وليس ترجمة حرفية)، ووزّعها بين نية معلوماتية وتجارية وشرائية.",
        "أنهِ بقسم «ابدأ بهذه الثلاث» مع سبب مختصر لكل واحدة.",
      ].join("\n"),
  },
  {
    id: "seo-article",
    employeeId: "nour",
    title: "مقال SEO كامل",
    summary: "مقال جاهز للنشر مع عناوين فرعية، ميتا، وروابط داخلية مقترحة.",
    kind: "مقال",
    channel: "wordpress",
    fields: [
      {
        name: "keyword",
        label: "الكلمة المفتاحية المستهدفة",
        type: "text",
        placeholder: "شراء تمور بالجملة",
        required: true,
      },
      {
        name: "length",
        label: "الطول",
        type: "select",
        options: ["800 كلمة", "1200 كلمة", "1500 كلمة", "2000 كلمة"],
        defaultValue: "1200 كلمة",
      },
      {
        name: "audience",
        label: "الجمهور",
        type: "text",
        placeholder: "مدراء مشتريات في الشركات",
      },
      tone,
      {
        name: "notes",
        label: "نقاط يجب ذكرها (اختياري)",
        type: "textarea",
        placeholder: "عرض الشحن المجاني، شهادة الجودة…",
      },
    ],
    buildPrompt: (v) =>
      [
        `اكتب مقالاً عربياً كاملاً جاهزاً للنشر حول الكلمة المفتاحية: «${v['keyword']}».`,
        `الطول المستهدف: ${v['length']}. الجمهور: ${v['audience'] || "عملاء العلامة"}. النبرة: ${v['tone']}.`,
        v['notes'] ? `نقاط يجب تغطيتها: ${v['notes']}` : "",
        "الهيكل المطلوب بصيغة Markdown:",
        "1) عنوان H1 جذاب يحتوي الكلمة المفتاحية.",
        "2) وصف ميتا لا يتجاوز 155 حرفاً.",
        "3) مقدمة من 3 أسطر تُثبت الفهم لمشكلة القارئ.",
        "4) 5–8 عناوين H2 مع فقرات قصيرة وقوائم عند الحاجة.",
        "5) جدول مقارنة أو قائمة تحقق واحدة على الأقل.",
        "6) قسم أسئلة شائعة (4 أسئلة) بصيغة مناسبة للـ FAQ Schema.",
        "7) خاتمة بدعوة إجراء واضحة.",
        "8) قسم أخير بعنوان «روابط داخلية مقترحة» يذكر 3 صفحات يجب الربط بها.",
        "لا تحشُ الكلمة المفتاحية؛ اجعل الكثافة طبيعية وأضف مرادفات.",
      ]
        .filter(Boolean)
        .join("\n"),
  },
  {
    id: "page-optimize",
    employeeId: "nour",
    title: "تحسين صفحة قائمة",
    summary: "تدقيق نص صفحتك الحالية وإعادة كتابته مع أسباب كل تعديل.",
    kind: "تحسين محتوى",
    channel: "seo",
    fields: [
      {
        name: "keyword",
        label: "الكلمة المستهدفة",
        type: "text",
        placeholder: "خدمة استشارات مالية",
        required: true,
      },
      {
        name: "content",
        label: "نص الصفحة الحالي",
        type: "textarea",
        placeholder: "الصق النص هنا…",
        required: true,
      },
    ],
    buildPrompt: (v) =>
      [
        `حسّن هذه الصفحة لتتصدّر الكلمة: «${v['keyword']}».`,
        "أعد المخرج على ثلاثة أقسام:",
        "أ) «تشخيص سريع»: أهم 5 مشاكل في النص الحالي (سيو + إقناع) مرتّبة بالأثر.",
        "ب) «النص المحسّن»: إعادة كتابة كاملة جاهزة للصق، مع عناوين H1/H2 ووصف ميتا.",
        "ج) «ماذا تغيّر ولماذا»: جدول قصير يربط كل تعديل بالفائدة المتوقعة.",
        "",
        "النص الحالي:",
        v['content'],
      ].join("\n"),
  },
  {
    id: "meta-pack",
    employeeId: "nour",
    title: "عناوين وأوصاف ميتا",
    summary: "خمس نسخ من عنوان ووصف الصفحة قابلة للاختبار.",
    kind: "ميتا",
    channel: "seo",
    fields: [
      {
        name: "page",
        label: "الصفحة أو الموضوع",
        type: "text",
        placeholder: "صفحة الأسعار",
        required: true,
      },
      { name: "keyword", label: "الكلمة المستهدفة", type: "text", placeholder: "أسعار الاشتراك" },
    ],
    buildPrompt: (v) =>
      [
        `اكتب 5 خيارات عنوان ووصف ميتا لصفحة «${v['page']}»${v['keyword'] ? ` مستهدفاً «${v['keyword']}»` : ""}.`,
        "جدول Markdown بالأعمدة: | # | العنوان (≤60 حرفاً) | الوصف (≤155 حرفاً) | زاوية الإقناع |",
        "اجعل كل خيار بزاوية مختلفة: فائدة، رقم/دليل، سؤال، مقارنة، عاجل.",
        "ثم اذكر توصيتك بخيار واحد وسبب اختياره.",
      ].join("\n"),
  },
  {
    id: "blog-calendar",
    employeeId: "nour",
    title: "تقويم مقالات شهري",
    summary: "خطة مقالات لشهر كامل مربوطة بمراحل رحلة العميل.",
    kind: "تقويم محتوى",
    channel: "wordpress",
    fields: [
      { name: "count", label: "عدد المقالات", type: "number", defaultValue: "8" },
      { name: "goal", label: "الهدف", type: "text", placeholder: "زيادة طلبات التسعير" },
    ],
    buildPrompt: (v) =>
      [
        `ضع تقويم مدونة لشهر واحد يضم ${v['count'] || 8} مقالات${v['goal'] ? ` بهدف: ${v['goal']}` : ""}.`,
        "جدول Markdown: | الأسبوع | العنوان | الكلمة المستهدفة | نية البحث | مرحلة العميل | دعوة الإجراء |",
        "نوّع بين مقالات وعي ومقارنة وقرار، وأنهِ بملاحظة عن أي مقالين يستحقان الأولوية.",
      ].join("\n"),
  },
];

export function skillsFor(employeeId: string) {
  return skills.filter((s) => s.employeeId === employeeId);
}

export function getSkill(id: string) {
  return skills.find((s) => s.id === id);
}
