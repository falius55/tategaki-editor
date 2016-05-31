import java.io.*;
import java.sql.*;
import java.net.*;
import java.util.*;
import javax.xml.*;
//import javax.servlet.*;
//import javax.servlet.http.*;

public class KanjiSystem {
	String sentence;
	String rtnString;

	//public void doPost(HttpServletRequest request, HttpServletResponse response)
	//	throws IOException, ServletException {
	//	try{
	//	response.setContentType("application/json; charset=UTF-8");
	//	PrintWriter out = response.getWriter();

	//	sentence = request.getParameter("sentence");
	//	rtnString = getData(sentence);
	//	log("rtnString:" + rtnString);
	//	System.out.println("rtnString:" + rtnString);

	//	out.println(rtnString);
	//	out.close();
	//	}catch(IOException e){
	//		log(e.getMessage());
	//	}catch(Exception e){
	//		log(e.getMessage());
	//	}
	//}
	public static void main(String args[]) {
		String out = getData(args[0]);
		System.out.println("out.length:" + out.length());
		System.out.println(out);
		System.out.println("end");
	}

	public static String getData(String str){
		byte[] b = new byte[10000];
		try{
			// Google CGI API for Japanese Input(Google日本語入力API)
		String strUrl = "http://www.google.com/transliterate?langpair=ja-Hira|ja&text=" + str;
		// Yahooデベロッパーネットワーク かな漢字変換
		//String strUrl = "http://jlp.yahooapis.jp/JIMService/V1/conversion?appid=dj0zaiZpPTZqSXRTQURJbUI3eCZzPWNvbnN1bWVyc2VjcmV0Jng9ZTg-&sentence=" + str;
		URL url = new URL(strUrl);
		InputStream in = url.openStream();
		BufferedInputStream br = new BufferedInputStream(in);
		br.read(b);
		br.close();
		in.close();
		}catch(MalformedURLException e){
			System.err.println(e);
		}catch(IOException e){
			System.err.println(e);
		}
		int i;
		for(i = 0;b[i] != 0 && i<b.length;i++);
		System.out.println("i" + i);
		return new String(b,0,i);
	}
}
