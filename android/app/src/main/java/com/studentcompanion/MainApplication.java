package com.studentcompanion;

import android.app.Application;
import android.util.Log;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.wix.RNCameraKit.RNCameraKitPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.invertase.firebase.RNFirebasePackage;
import net.no_mad.tts.TextToSpeechPackage;
import cl.json.RNSharePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.crash.RNFirebaseCrashPackage;

import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativenavigation.NavigationApplication;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    // Add additional packages you require here
    // No need to add RnnPackage and MainReactPackage
    return Arrays.<ReactPackage>asList(
      new RNFirebasePackage(),
      new TextToSpeechPackage(),
      new RNSharePackage(),
      new PickerPackage(),
      new RNFirebaseAnalyticsPackage(),
      new RNFirebaseCrashPackage(),
      new ReactNativePushNotificationPackage(),
      new RNDeviceInfo(),
      new RNCameraKitPackage(),
      new RNFetchBlobPackage(),
      new ImagePickerPackage()
    );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }
}