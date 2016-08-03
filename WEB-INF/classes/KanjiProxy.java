import java.io.PrintWriter;
import java.io.InputStream;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.net.URL;
import java.net.MalformedURLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class KanjiProxy extends HttpServlet {
	String sentence;
	String rtnString;

	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		try{
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter out = response.getWriter();

		sentence = request.getParameter("sentence");
		rtnString = getData(sentence);

		log("rtnKanjiJson:"+ rtnString);
		out.println(rtnString);
		out.close();
		}catch(IOException e){
			log(e.getMessage());
		}catch(Exception e){
			log(e.getMessage());
		}
	}

	public static void main(String args[]) {
		System.out.println(getData(args[0]));
	}

	public static String getData(String str){
		byte[] b = new byte[10000];
		try{
			// Google CGI API for Japanese Input(Google日本語入力API)
		String strUrl = "http://www.google.com/transliterate?langpair=ja-Hira|ja&text=" + str;
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
		for(i = 0;b[i] != 0 && i < b.length;i++); // 読み込みバイト数を数える
		return new String(b,0,i);
	}
}
