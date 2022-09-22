import cx from "classnames";
import { forwardRef, InputHTMLAttributes, Ref, useId } from "react";

const colorClassname = {
  primary: "text-primary focus:ring-primary",
  secondary: "text-secondary focus:ring-secondary",
  accent: "text-accent focus:ring-accent",
};

const sizeClassname = {
  xs: "w-3.5 h-3.5 rounded-sm focus:ring-2",
  sm: "w-4 h-4 rounded-sm focus:ring-2",
  md: "w-5 h-5 rounded focus:ring",
  lg: "w-6 h-6 rounded focus:ring",
};

const labelSizeClassname = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "size"
  > {
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  color?: keyof typeof colorClassname;
  size?: keyof typeof sizeClassname;
  label?: string;
  labelSize?: keyof typeof labelSizeClassname;
  disabled?: boolean;
}

export const Checkbox = forwardRef(
  (
    {
      checked,
      onValueChange,
      color = "primary",
      size = "md",
      label,
      labelSize = "md",
      disabled,
      className,
      ...props
    }: CheckboxProps,
    ref?: Ref<HTMLInputElement>
  ) => {
    const id = useId();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      onValueChange?.(checked);
    };

    return (
      <label
        htmlFor={id}
        className={cx(
          "inline-flex items-center select-none",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className
        )}
      >
        <input
          {...props}
          id={id}
          ref={ref}
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={handleChange}
          className={cx(
            colorClassname[color],
            sizeClassname[size],
            "bg-transparent border-2 border-base-200",
            "disabled:opacity-50",
            "disabled:cursor-not-allowed",
            { "cursor-pointer hover:bg-base-200": !disabled },
            "focus:outline-none focus:ring-offset-0 focus:ring-primary focus:ring-4 focus:ring-opacity-50"
          )}
        />
        {label && (
          <span
            className={cx(
              "ml-2 select-none",
              labelSizeClassname[labelSize],
              !disabled &&
                (checked ? "opacity-100" : "opacity-50 hover:opacity-100"),
              { "opacity-50": disabled }
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
