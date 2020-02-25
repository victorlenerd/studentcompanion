package com.studentcompanion;

import android.app.Application;
import android.util.Log;

import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;

import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import com.facebook.react.ReactApplication;
import org.wonday.pdf.RCTPdfView;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.arttitude360.reactnative.rnpaystack.RNPaystackPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.wix.RNCameraKit.RNCameraKitPackage;
import net.no_mad.tts.TextToSpeechPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.facebook.soloader.SoLoader;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

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
            new RCTPdfView(),
            new RNGestureHandlerPackage(),
            new RNPaystackPackage(),
            new AsyncStoragePackage(),
            new RNCWebViewPackage(),
            new RNScreensPackage(),
            new RandomBytesPackage(),
            new RNCameraKitPackage(),
            new TextToSpeechPackage(),
            new RNFetchBlobPackage(),
            new NetInfoPackage(),
            new ReanimatedPackage(),
            new RNDeviceInfo(),
            new PickerPackage(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new RNFirebaseAnalyticsPackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseFunctionsPackage(),
            new RNFirebaseDatabasePackage(),
            new RNFirebasePackage(),
            new FIRMessagingPackage()
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