import { motion } from "framer-motion";

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({
  id,
  title,
  subtitle,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      data-section
      className={[
        "snap-section relative flex min-h-screen items-start scroll-mt-12 border-b border-slate-700/60 py-8",
        className ?? "",
      ].join(" ")}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full space-y-4"
      >
        {title ? (
          <div>
            <h2 className="text-3xl font-semibold text-white">{title}</h2>
            {subtitle ? (
              <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
            ) : null}
          </div>
        ) : null}
        {children}
      </motion.div>
    </section>
  );
}
