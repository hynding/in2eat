import styles from "./Button.module.css";

type Variant = "primary" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: Variant;
}

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={[styles.button, className].filter(Boolean).join(" ")} data-variant={variant} {...props} />;
}

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly variant?: Variant;
}

/** For external links styled as buttons. Internal navigation should use next/link. */
export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <a className={[styles.button, className].filter(Boolean).join(" ")} data-variant={variant} {...props} />;
}

export const buttonClassName = styles.button;
