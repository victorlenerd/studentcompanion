package com.studentcompanion;

import com.reactnativenavigation.controllers.SplashActivity;

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
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static com.facebook.react.common.ReactConstants.TAG;


public class MainActivity extends SplashActivity {
    private Mat src, srcOrig;
    private String errorMsg;
    private static int scaleFactor;

//    private BaseLoaderCallback mLoaderCallback = new BaseLoaderCallback(this) {
//        @Override
//        public void onManagerConnected(int status) {
//            switch (status) {
//                case LoaderCallbackInterface.SUCCESS:
//                {
//                    Log.i("OpenCV", "OpenCV loaded successfully");
//                    Mat imageMat = new Mat();
//                } break;
//                default:
//                {
//                    super.onManagerConnected(status);
//                } break;
//            }
//        }
//    };
//
//    @Override
//    public void onResume() {
//        super.onResume();
//        if (!OpenCVLoader.initDebug()) {
//            Log.d("OpenCV", "Internal OpenCV library not found. Using OpenCV Manager for initialization");
//            OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION_2_4_13, this, mLoaderCallback);
//        } else {
//            Log.d("OpenCV", "OpenCV library found inside package. Using it!");
//            mLoaderCallback.onManagerConnected(LoaderCallbackInterface.SUCCESS);
//        }
//    }
//
//    public void getPage(Bitmap selectedImage) {
//        srcOrig = new Mat(selectedImage.getHeight(), selectedImage.getWidth(), CvType.CV_8UC4);
//        src = new Mat();
//        Utils.bitmapToMat(selectedImage, srcOrig);
//        scaleFactor = calcScaleFactor(srcOrig.rows(), srcOrig.cols());
//        Imgproc.resize(srcOrig, src, new Size(srcOrig.rows() / scaleFactor, srcOrig.cols() / scaleFactor));
//        new AsyncTask<Void, Void, Bitmap>() {
//            ProgressDialog dialog;
//
//            @Override
//            protected void onPreExecute() {
//                super.onPreExecute();
//            }
//
//            @Override
//            protected Bitmap doInBackground(Void... params) {
//
//                Mat srcRes = new Mat(src.size(), src.type());
//                Mat srcGray = new Mat();
//
//                Mat samples = new Mat(src.rows() * src.cols(), 3, CvType.CV_32F);
//                for (int y = 0; y < src.rows(); y++) {
//                    for (int x = 0; x < src.cols(); x++) {
//                        for (int z = 0; z < 3; z++) {
//                            samples.put(x + y * src.cols(), z, src.get(y, x)[z]);
//                        }
//                    }
//                }
//
//                int clusterCount = 2;
//                Mat labels = new Mat();
//                int attempts = 5;
//                Mat centers = new Mat();
//
//                Core.kmeans(samples, clusterCount, labels, new TermCriteria(TermCriteria.MAX_ITER | TermCriteria.EPS, 10000, 0.0001), attempts, Core.KMEANS_PP_CENTERS, centers);
//
//                double dstCenter0 = calcWhiteDist(centers.get(0, 0)[0], centers.get(0, 1)[0], centers.get(0, 2)[0]);
//                double dstCenter1 = calcWhiteDist(centers.get(1, 0)[0], centers.get(1, 1)[0], centers.get(1, 2)[0]);
//
//                int paperCluster = (dstCenter0 < dstCenter1) ? 0 : 1;
//                //
//                //                double[] black = {0, 0, 0};
//                //                double[] white = {255, 255, 255};
//
//                for (int y = 0; y < src.rows(); y++) {
//                    for (int x = 0; x < src.cols(); x++) {
//                        int cluster_idx = (int) labels.get(x + y * src.cols(), 0)[0];
//                        if (cluster_idx != paperCluster) {
//                            srcRes.put(y, x, 0, 0, 0, 255);
//                        } else {
//                            srcRes.put(y, x, 255, 255, 255, 255);
//                        }
//                    }
//                }
//
//                // Imgproc.medianBlur(srcRes, srcRes, 5);
//
//                //                Mat kernel = Imgproc.getStructuringElement(Imgproc.CV_SHAPE_RECT, new Size(10, 10));
//
//                //                // Opening to remove small noise pixels
//                //                Imgproc.erode(srcRes, srcRes, kernel);
//                //                Imgproc.dilate(srcRes, srcRes, kernel);
//                //
//                //                // Closing to fill in gaps
//                //                Imgproc.dilate(srcRes, srcRes, kernel);
//                //                Imgproc.erode(srcRes, srcRes, kernel);
//
//
//                // TODO Potential error in opencv
//                Imgproc.cvtColor(src, srcGray, Imgproc.COLOR_BGR2GRAY);
//                Imgproc.Canny(srcGray, srcGray, 50, 150);
//                List<MatOfPoint> contours = new ArrayList<MatOfPoint>();
//                Mat hierarchy = new Mat();
//
//                Imgproc.findContours(srcGray, contours, hierarchy, Imgproc.RETR_TREE, Imgproc.CHAIN_APPROX_SIMPLE);
//
//                int index = 0;
//                double maxim = Imgproc.contourArea(contours.get(0));
//
//                for (int contourIdx = 1; contourIdx < contours.size(); contourIdx++) {
//                    double temp;
//                    temp = Imgproc.contourArea(contours.get(contourIdx));
//                    if (maxim < temp) {
//                        maxim = temp;
//                        index = contourIdx;
//                    }
//                }
//
//                Mat drawing = Mat.zeros(srcRes.size(), CvType.CV_8UC1);
//                Imgproc.drawContours(drawing, contours, index, new Scalar(255), 1);
//
//                Mat lines = new Mat();
//                Imgproc.HoughLinesP(drawing, lines, 1, Math.PI / 180, 70, 30, 10);
//
//                ArrayList<Point> corners = new ArrayList<Point>();
//                for (int i = 0; i < lines.cols(); i++) {
//                    for (int j = i + 1; j < lines.cols(); j++) {
//                        double[] line1 = lines.get(0, i);
//                        double[] line2 = lines.get(0, j);
//
//                        Point pt = findIntersection(line1, line2);
//                        Log.d("com.packtpub.chapter10", pt.x + " " + pt.y);
//                        if (pt.x >= 0 && pt.y >= 0 && pt.x <= drawing.cols() && pt.y <= drawing.rows()) {
//                            if (!exists(corners, pt)) {
//                                corners.add(pt);
//                            }
//                        }
//                    }
//                }
//
//                if (corners.size() != 4) {
//                    errorMsg = "Cannot detect perfect corners";
//                    Bitmap bitmap = Bitmap.createBitmap(drawing.cols(), drawing.rows(), Bitmap.Config.ARGB_8888);
//                    Utils.matToBitmap(drawing, bitmap);
//
//                    return bitmap;
//                    //                    return null;
//                }
//
//                sortCorners(corners);
//
//                if (corners.size() == 0) {
//                    errorMsg = "Cannot sort corners";
//                    return null;
//                }
//
//                double top = Math.sqrt(Math.pow(corners.get(0).x - corners.get(1).x, 2) + Math.pow(corners.get(0).y - corners.get(1).y, 2));
//                double right = Math.sqrt(Math.pow(corners.get(1).x - corners.get(2).x, 2) + Math.pow(corners.get(1).y - corners.get(2).y, 2));
//                double bottom = Math.sqrt(Math.pow(corners.get(2).x - corners.get(3).x, 2) + Math.pow(corners.get(2).y - corners.get(3).y, 2));
//                double left = Math.sqrt(Math.pow(corners.get(3).x - corners.get(1).x, 2) + Math.pow(corners.get(3).y - corners.get(1).y, 2));
//
//                Mat quad = Mat.zeros(new Size(Math.max(top, bottom), Math.max(left, right)), CvType.CV_8UC3);
//
//                ArrayList<Point> result_pts = new ArrayList<Point>();
//                result_pts.add(new Point(0, 0));
//                result_pts.add(new Point(quad.cols(), 0));
//                result_pts.add(new Point(quad.cols(), quad.rows()));
//                result_pts.add(new Point(0, quad.rows()));
//
//
//                Mat cornerPts = Converters.vector_Point2f_to_Mat(corners);
//                Mat resultPts = Converters.vector_Point2f_to_Mat(result_pts);
//
//                Log.d("com.packtpub.chapter10", cornerPts.checkVector(2, CvType.CV_32F) + " " + resultPts.checkVector(2, CvType.CV_32F) + " " + CvType.CV_32F + " " + cornerPts.type());
//
//                Mat transformation = Imgproc.getPerspectiveTransform(cornerPts, resultPts);
//                Imgproc.warpPerspective(srcOrig, quad, transformation, quad.size());
//
//                Bitmap bitmap = Bitmap.createBitmap(quad.cols(), quad.rows(), Bitmap.Config.ARGB_8888);
//                Utils.matToBitmap(quad, bitmap);
//
//                return bitmap;
//            }
//
//            @Override
//            protected void onPostExecute(Bitmap bitmap) {
//                super.onPostExecute(bitmap);
//                dialog.dismiss();
//                if (bitmap != null) {
//
//
//                    String root = Environment.getExternalStorageDirectory().toString();
//                    File myDir = new File(root + "/student_companion_images");
//                    myDir.mkdirs();
//                    Random generator = new Random();
//                    int n = 10000;
//                    n = generator.nextInt(n);
//                    String fname = "Image-" + n + ".jpg";
//                    File file = new File(myDir, fname);
//                    Log.i(TAG, "" + file);
//                    if (file.exists())
//                        file.delete();
//                    try {
//                        FileOutputStream out = new FileOutputStream(file);
//                        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, out);
//                        out.flush();
//                        out.close();
//                        promise.resolve("WORKS!!!");
//                    } catch (Exception e) {
//                        e.printStackTrace();
//                    }
//                } else if (errorMsg != null) {
//                    Toast.makeText(rContext.getApplicationContext(), errorMsg, Toast.LENGTH_SHORT).show();
//                }
//            }
//        }.execute();
//    }
}
