package com.studentcompanion;

import android.app.Application;
import android.util.Log;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import io.invertase.firebase.RNFirebasePackage;
import net.no_mad.tts.TextToSpeechPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.crash.RNFirebaseCrashPackage;
import com.facebook.react.ReactApplication;
import com.wix.RNCameraKit.RNCameraKitPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.facebook.soloader.SoLoader;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rnfs.RNFSPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;
import com.evollu.react.fcm.FIRMessagingPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
      protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNCameraKitPackage(),
          new PickerPackage(),
          new RandomBytesPackage(),
          new RNFSPackage(),
          new RNFirebasePackage(),
          new TextToSpeechPackage(),
          new FIRMessagingPackage(),
          new RNFirebaseAnalyticsPackage(),
          new RNFirebaseCrashPackage(),
          new RNDeviceInfo(),
          new RNFetchBlobPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}