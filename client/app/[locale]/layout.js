import { Inter } from "next/font/google";
import initTranslations from "../i18n";
import TranslationProvider from "@/components/TranslationProvider/TranslationProvider";
import LanguageContextProvider from "@/context/LanguageContext";
import DimensionContextProvider from "@/context/DimensionContext";
import SideMenuProvider from "@/context/SideMenuContext";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import { UserDataProvider } from "@/context/UserDatasContext";
import ClinicalRecordProvider from "@/context/ClinicalRecordContext";
import TranslateModeProvider from "@/context/TranslateMode";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Doctor",
  description: "Designed By Kourosh Mohajeri - Web Gallery",
};

export default async function RootLayout({ children, params: { locale } }) {
  const namespaces = [
    "Header",
    "Alert",
    "Labels",
    "Specialities",
    "Doctors",
    "Steps",
    "TimeLine",
    "Blog",
  ];
  const { resources } = await initTranslations(locale, namespaces);
  const direction = locale === "fa" ? "rtl" : "ltr";
  return (
    <UserDataProvider>
      <TranslationProvider
        resources={resources}
        locale={locale}
        namespaces={namespaces}
      >
        <html lang={locale} dir={direction}>
          <body className={inter.className}>
            <TranslateModeProvider>
              <LanguageContextProvider>
                <DimensionContextProvider>
                  <SideMenuProvider>
                    <ClinicalRecordProvider>{children}</ClinicalRecordProvider>
                  </SideMenuProvider>
                </DimensionContextProvider>
              </LanguageContextProvider>
            </TranslateModeProvider>
          </body>
        </html>
      </TranslationProvider>
    </UserDataProvider>
  );
}
