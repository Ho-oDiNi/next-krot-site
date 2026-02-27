import emailIcon from "@icons/email-red-fill.svg";
import phoneIcon from "@icons/phone-red-fill.svg";
import warningIcon from "@icons/warning-red-fill.svg";
import gearIcon from "@icons/gear-red-fill.svg";

import FooterBlock from "./FooterBlock";
import ContactItem from "./ContactItem";
import EmergencyService from "./EmergencyService";
import FooterLinks from "./FooterLinks";

import { FOOTER_GEOGRAPHY_LINKS, FOOTER_SERVICE_LINKS } from "../config";
import { SITE_NAVIGATION_LINKS } from "@/shared/lib/site-links";
import { GradientHide } from "@/shared/ui/GradientHide";

const FooterTop = () => {
    return (
        <div className="bg-blue-900 px-(--space-inside-x) pt-14 pb-6">
            <div className="container mx-auto grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                <FooterBlock title="Контакты" href="/contacts">
                    <address className="flex flex-col gap-4 not-italic">
                        <GradientHide variant="blue">
                            <ContactItem
                                icon={phoneIcon}
                                alt=""
                                href="tel:+79831383413"
                            >
                                + 7 (983) 138 - 34 - 13
                            </ContactItem>
                        </GradientHide>
                        <ContactItem
                            icon={emailIcon}
                            alt=""
                            href="mailto:info@alpforce.ru"
                        >
                            info@alpforce.ru
                        </ContactItem>
                        <ContactItem icon={warningIcon} alt="" href="/contacts">
                            Пн-Пт: 8:00-20:00
                            <br />
                            Аварийная служба: 24/7
                        </ContactItem>
                        <ContactItem
                            icon={gearIcon}
                            alt=""
                            href="https://codecompode.tilda.ws"
                        >
                            Разработка сайта
                        </ContactItem>
                    </address>
                </FooterBlock>

                <FooterBlock title="Услуги" href="/services">
                    <FooterLinks links={FOOTER_SERVICE_LINKS} />
                </FooterBlock>

                <FooterBlock title="Компания" href="/about">
                    <FooterLinks links={SITE_NAVIGATION_LINKS} />
                </FooterBlock>

                <FooterBlock
                    title="География работ"
                    href="/about#geography_of_work"
                >
                    <FooterLinks links={FOOTER_GEOGRAPHY_LINKS} />
                    <EmergencyService />
                </FooterBlock>
            </div>
        </div>
    );
};

export default FooterTop;
