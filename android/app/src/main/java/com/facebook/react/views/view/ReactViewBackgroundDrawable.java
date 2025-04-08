/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.views.view;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ColorFilter;
import android.graphics.DashPathEffect;
import android.graphics.Outline;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PathEffect;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;
import android.os.Build;
import androidx.annotation.Nullable;
import com.facebook.react.common.annotations.VisibleForTesting;
import com.facebook.react.uimanager.FloatUtil;
import com.facebook.react.uimanager.Spacing;
import java.util.Arrays;
import java.util.Locale;

/**
 * A compatibility class for ReactViewBackgroundDrawable that was removed in React Native 0.78
 * This is a simplified version that provides the basic functionality needed by React Native Reanimated
 */
public class ReactViewBackgroundDrawable extends Drawable {

  private static final int DEFAULT_BORDER_RGB = 0x00000000;

  private final Paint mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
  private int mColor = Color.TRANSPARENT;
  private int mAlpha = 255;

  private @Nullable RectF mPathForBorderRadius;
  private @Nullable Path mPathForBorderRadiusOutline;

  public ReactViewBackgroundDrawable() {
    // Initialize with default values
    initBackground();
  }

  private void initBackground() {
    mPaint.setStyle(Paint.Style.FILL);
    mPaint.setColor(mColor);
    mPaint.setAlpha(mAlpha);
  }

  @Override
  public void draw(Canvas canvas) {
    if (mPathForBorderRadius != null) {
      canvas.drawPath(getPathForBorderRadius(), mPaint);
    } else {
      canvas.drawRect(getBounds(), mPaint);
    }
  }

  @Override
  protected void onBoundsChange(Rect bounds) {
    super.onBoundsChange(bounds);
    mPathForBorderRadius = null;
    mPathForBorderRadiusOutline = null;
  }

  @Override
  public void setAlpha(int alpha) {
    if (alpha != mAlpha) {
      mAlpha = alpha;
      mPaint.setAlpha(alpha);
      invalidateSelf();
    }
  }

  @Override
  public int getAlpha() {
    return mAlpha;
  }

  @Override
  public void setColorFilter(ColorFilter colorFilter) {
    mPaint.setColorFilter(colorFilter);
    invalidateSelf();
  }

  @Override
  public int getOpacity() {
    return PixelFormat.TRANSLUCENT;
  }

  private Path getPathForBorderRadius() {
    if (mPathForBorderRadius == null) {
      mPathForBorderRadius = new RectF(getBounds());
    }

    Path path = new Path();
    path.addRect(mPathForBorderRadius, Path.Direction.CW);
    return path;
  }

  @VisibleForTesting
  public int getColor() {
    return mColor;
  }

  public void setColor(int color) {
    mColor = color;
    mPaint.setColor(color);
    invalidateSelf();
  }
} 