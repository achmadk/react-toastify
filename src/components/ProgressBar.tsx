import * as React from 'react';
import cx from 'clsx';

import { TYPE, Default, isFn } from './../utils';
import { TypeOptions, ToastClassName } from '../types';

export interface ProgressBarProps {
  /**
   * The animation delay which determine when to close the toast
   */
  delay: number;

  /**
   * Whether or not the animation is running or paused
   */
  isRunning: boolean;

  /**
   * Function to close the current toast
   */
  closeToast: () => void;

  /**
   * Optional type : info, success, warning, error, default, dark.
   */
  type: TypeOptions;

  /**
   * Hide or not the progress bar
   */
  hide?: boolean;

  /**
   * Optional className
   */
  className?: ToastClassName;

  /**
   * Optional inline style
   */
  style?: React.CSSProperties;

  /**
   * Tell wether or not controlled progress bar is used
   */
  controlledProgress?: boolean;

  /**
   * Controlled progress value
   */
  progress?: number | string;

  /**
   * Support rtl content
   */
  rtl?: boolean;

  /**
   * Tell if the component is visible on screen or not
   */
  isIn?: boolean;
}

export function ProgressBar({
  delay,
  isRunning,
  closeToast,
  type,
  hide,
  className,
  style: userStyle,
  controlledProgress,
  progress,
  rtl,
  isIn
}: ProgressBarProps) {
  const style: React.CSSProperties = {
    ...userStyle,
    animationDuration: `${delay}ms`,
    animationPlayState: isRunning ? 'running' : 'paused',
    opacity: hide ? 0 : 1
  };

  if (controlledProgress) style.transform = `scaleX(${progress})`;
  const defaultClassName = cx(
    `${Default.CSS_NAMESPACE}__progress-bar`,
    controlledProgress
      ? `${Default.CSS_NAMESPACE}__progress-bar--controlled`
      : `${Default.CSS_NAMESPACE}__progress-bar--animated`,
    `${Default.CSS_NAMESPACE}__progress-bar--${type}`,
    {
      [`${Default.CSS_NAMESPACE}__progress-bar--rtl`]: rtl
    }
  );
  const classNames = isFn(className)
    ? className({
        rtl,
        type,
        defaultClassName
      })
    : cx(defaultClassName, className);

  // 🧐 controlledProgress is derived from progress
  // so if controlledProgress is set
  // it means that this is also the case for progress
  const animationEvent = {
    [controlledProgress && progress! >= 1
      ? 'onTransitionEnd'
      : 'onAnimationEnd']:
      controlledProgress && progress! < 1
        ? null
        : () => {
            isIn && closeToast();
          }
  };

  // TODO: add aria-valuenow, aria-valuemax, aria-valuemin

  return (
    <div
      role="progressbar"
      className={classNames}
      style={style}
      {...animationEvent}
    />
  );
}

ProgressBar.defaultProps = {
  type: TYPE.DEFAULT,
  hide: false
};
