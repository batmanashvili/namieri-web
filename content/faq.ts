/**
 * FAQ, from verified facts only (Website Brief, "Product facts"). The first
 * HOME_FAQ_COUNT entries also appear on the landing page. Numbers come from
 * content/product.ts so an answer can't drift from the label.
 *
 * Answers are plain text, because they are also published as FAQPage
 * structured data. Links go in `links`, shown under the answer.
 */
import {
  company,
  nutritionFor,
  nutritionPer100g,
  SERVING_GRAMS,
  storage,
  type Localized,
} from "./product";

export type FaqLink = { href: string; label: Localized };

export type FaqEntry = {
  id: string;
  question: Localized;
  answer: Localized;
  links?: readonly FaqLink[];
};

const n = nutritionPer100g;
const proteinPerServing = nutritionFor(SERVING_GRAMS).proteinG;
const proteinPerTub = nutritionFor(500).proteinG;

export const faq: readonly FaqEntry[] = [
  {
    id: "storage",
    question: { ka: "როგორ შევინახო?", en: "How should I store it?" },
    answer: {
      ka: `შეინახეთ მაცივარში, +${storage.tempMinC}…+${storage.tempMaxC} °C ტემპერატურაზე. გაუხსნელი ${storage.shelfLifeUnopenedDays} დღე ინახება; გახსნის შემდეგ მიირთვით ${storage.shelfLifeOpenedDays} დღის განმავლობაში.`,
      en: `Keep it in the fridge at +${storage.tempMinC}…+${storage.tempMaxC} °C. It keeps ${storage.shelfLifeUnopenedDays} days unopened; eat it within ${storage.shelfLifeOpenedDays} days of opening.`,
    },
  },
  {
    id: "fat",
    question: { ka: "მართლა უცხიმოა?", en: "Is it really fat-free?" },
    answer: {
      ka: `დიახ: 100 გრამში ${n.fatG} გ ცხიმია.`,
      en: `Yes: ${n.fatG} g fat per 100 g.`,
    },
  },
  {
    id: "sugar",
    question: { ka: "შეიცავს შაქარს?", en: "Does it contain sugar?" },
    answer: {
      ka: `100 გრამში ${n.sugarsG} გ, მთლიანად რძის ბუნებრივი შაქარი (ლაქტოზა). შაქარი არ ემატება.`,
      en: `${n.sugarsG} g per 100 g, all natural milk sugar (lactose). No sugar is added.`,
    },
  },
  {
    id: "lactose",
    question: { ka: "ულაქტოზოა?", en: "Is it lactose-free?" },
    answer: {
      ka: "არა. იოგურტი რძისგან მზადდება და ლაქტოზას შეიცავს.",
      en: "No. It is made from milk and contains lactose.",
    },
  },
  {
    id: "delivery",
    question: { ka: "სად აწვდით?", en: "Where do you deliver?" },
    answer: {
      ka: "თბილისის ფარგლებში, ჩვენი მიწოდებით ან Wolt-ით.",
      en: "Within Tbilisi, through our own delivery or Wolt.",
    },
  },
  {
    id: "wholesale",
    question: {
      ka: "ამარაგებთ მაღაზიებსა და კაფეებს?",
      en: "Do you supply shops and cafés?",
    },
    answer: {
      ka: "დიახ. შეავსეთ საბითუმო ფორმა კონტაქტის გვერდზე.",
      en: "Yes. Use the wholesale form on the Contact page.",
    },
    links: [
      {
        href: "/contact#wholesale",
        label: { ka: "საბითუმო ფორმა", en: "Wholesale form" },
      },
    ],
  },
  {
    id: "cancel",
    question: {
      ka: "შემიძლია შეკვეთის გაუქმება ან დაბრუნება?",
      en: "Can I cancel or return an order?",
    },
    answer: {
      ka: `ნამიერი ახალი რძის პროდუქტია, ამიტომ მიწოდების შემდეგ დაბრუნებას ვერ ვიღებთ. შეკვეთის გასაუქმებლად ან შესაცვლელად დაგვიკავშირდით პირდაპირ ტელეფონით (${company.phone}) ან ელფოსტით (${company.email}) და დაგეხმარებით.`,
      en: `Namieri is a fresh dairy product, so we can't accept returns once delivered. To cancel or change an order, contact us directly by phone (${company.phone}) or email (${company.email}) and we'll help.`,
    },
    links: [
      { href: company.phoneHref, label: { ka: "დარეკვა", en: "Call us" } },
      { href: `mailto:${company.email}`, label: { ka: "მოგვწერეთ", en: "Email us" } },
    ],
  },
  {
    id: "ingredients",
    question: { ka: "რისგან მზადდება?", en: "What is it made from?" },
    answer: {
      // [CONFIRM] milk wording: "fresh Georgian milk" until Namieri confirms raw vs pasteurized.
      ka: "ახალი ქართული რძისა და ცოცხალი კულტურებისგან (YO-MIX® GREEK 01, YO-MIX® S32, HOLDBAC® YM-C). დანამატების, კონსერვანტებისა და მცენარეული ცხიმების გარეშე.",
      en: "Fresh Georgian milk and live cultures (YO-MIX® GREEK 01, YO-MIX® S32, HOLDBAC® YM-C). No additives, no preservatives and no vegetable fats.",
    },
  },
  {
    id: "protein",
    question: { ka: "რამდენი ცილაა?", en: "How much protein is in it?" },
    answer: {
      ka: `100 გრამში ${n.proteinG} გ: ${SERVING_GRAMS} გ ჭიქაში ${proteinPerServing} გ, 500 გ ქილაში კი ${proteinPerTub} გ.`,
      en: `${n.proteinG} g per 100 g: ${proteinPerServing} g in a ${SERVING_GRAMS} g cup and ${proteinPerTub} g in a 500 g tub.`,
    },
  },
  {
    id: "sizes",
    question: { ka: "რა ზომები არსებობს?", en: "Which sizes can I buy?" },
    answer: {
      ka: "150 გ ჭიქა და 500 გ ხელახლა დახურვადი ქილა. მესამე ზომა მალე გამოჩნდება.",
      en: "A 150 g cup and a 500 g resealable tub. A third size is coming soon.",
    },
  },
];
