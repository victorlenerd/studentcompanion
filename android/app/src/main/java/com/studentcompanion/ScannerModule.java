package com.studentcompanion;

import android.app.ProgressDialog;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;
import android.widget.ImageView;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.opencv.android.BaseLoaderCallback;
import org.opencv.android.LoaderCallbackInterface;
import org.opencv.android.OpenCVLoader;
import org.opencv.android.Utils;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfPoint;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.core.TermCriteria;
import org.opencv.imgproc.Imgproc;
import org.opencv.utils.Converters;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static com.facebook.react.common.ReactConstants.TAG;

/**
 * Created by Sleekvick on 1/4/18.
 */

public class ScannerModule extends ReactContextBaseJavaModule {

    private Uri fileUri;
    private ReactApplicationContext rContext;


    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

    };

    public ScannerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        rContext = reactContext;
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "Scanner";
    }

    // @ReactMethod
    // public void scan(String fileUrl, final Promise promise) {

    //     try {
    //         File image = new File(fileUrl);
    //         fileUri = Uri.fromFile(image);
    //         final InputStream imageStream = rContext.getContentResolver().openInputStream(fileUri);
    //         final Bitmap selectedImage = BitmapFactory.decodeStream(imageStream);
    //     } catch (FileNotFoundException e) {
    //         promise.reject(e);
    //     }
    // }

    // static double calcWhiteDist(double r, double g, double b){
    //     return Math.sqrt(Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2));
    // }

    // static Point findIntersection(double[] line1, double[] line2) {
    //     double start_x1 = line1[0], start_y1 = line1[1], end_x1 = line1[2], end_y1 = line1[3], start_x2 = line2[0], start_y2 = line2[1], end_x2 = line2[2], end_y2 = line2[3];
    //     double denominator = ((start_x1 - end_x1) * (start_y2 - end_y2)) - ((start_y1 - end_y1) * (start_x2 - end_x2));

    //     if (denominator!=0)
    //     {
    //         Point pt = new Point();
    //         pt.x = ((start_x1 * end_y1 - start_y1 * end_x1) * (start_x2 - end_x2) - (start_x1 - end_x1) * (start_x2 * end_y2 - start_y2 * end_x2)) / denominator;
    //         pt.y = ((start_x1 * end_y1 - start_y1 * end_x1) * (start_y2 - end_y2) - (start_y1 - end_y1) * (start_x2 * end_y2 - start_y2 * end_x2)) / denominator;
    //         return pt;
    //     }
    //     else
    //         return new Point(-1, -1);
    // }

    // static boolean exists(ArrayList<Point> corners, Point pt){
    //     for(int i=0; i<corners.size(); i++){
    //         if(Math.sqrt(Math.pow(corners.get(i).x-pt.x, 2)+Math.pow(corners.get(i).y-pt.y, 2)) < 10){
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // static void sortCorners(ArrayList<Point> corners)
    // {
    //     ArrayList<Point> top, bottom;

    //     top = new ArrayList<Point>();
    //     bottom = new ArrayList<Point>();

    //     Point center = new Point();

    //     for(int i=0; i<corners.size(); i++){
    //         center.x += corners.get(i).x/corners.size();
    //         center.y += corners.get(i).y/corners.size();
    //     }

    //     for (int i = 0; i < corners.size(); i++)
    //     {
    //         if (corners.get(i).y < center.y)
    //             top.add(corners.get(i));
    //         else
    //             bottom.add(corners.get(i));
    //     }
    //     corners.clear();

    //     if (top.size() == 2 && bottom.size() == 2){
    //         Point top_left = top.get(0).x > top.get(1).x ? top.get(1) : top.get(0);
    //         Point top_right = top.get(0).x > top.get(1).x ? top.get(0) : top.get(1);
    //         Point bottom_left = bottom.get(0).x > bottom.get(1).x ? bottom.get(1) : bottom.get(0);
    //         Point bottom_right = bottom.get(0).x > bottom.get(1).x ? bottom.get(0) : bottom.get(1);

    //         top_left.x *= scaleFactor;
    //         top_left.y *= scaleFactor;

    //         top_right.x *= scaleFactor;
    //         top_right.y *= scaleFactor;

    //         bottom_left.x *= scaleFactor;
    //         bottom_left.y *= scaleFactor;

    //         bottom_right.x *= scaleFactor;
    //         bottom_right.y *= scaleFactor;

    //         corners.add(top_left);
    //         corners.add(top_right);
    //         corners.add(bottom_right);
    //         corners.add(bottom_left);
    //     }
    // }

    // private static int calcScaleFactor(int rows, int cols){
    //     int idealRow, idealCol;
    //     if(rows<cols){
    //         idealRow = 240;
    //         idealCol = 320;
    //     } else {
    //         idealCol = 240;
    //         idealRow = 320;
    //     }
    //     int val = Math.min(rows / idealRow, cols / idealCol);
    //     if(val<=0){
    //         return 1;
    //     } else {
    //         return val;
    //     }
    // }
}
