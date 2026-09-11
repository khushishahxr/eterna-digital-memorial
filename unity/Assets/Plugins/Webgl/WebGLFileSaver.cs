#if UNITY_WEBGL && !UNITY_EDITOR
using System.Runtime.InteropServices;
#endif
using UnityEngine;
using System.Text;

public class WebGLExportHelper : MonoBehaviour
{
#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void SaveFile(string content, string fileName);
#endif

    public void ExportText()
    {
        string objData = "hello world";
        string fileName = "sample.txt";

#if UNITY_WEBGL && !UNITY_EDITOR
        SaveFile(objData, fileName);
#else
        Debug.Log("Saving only works in WebGL build.");
#endif
    }
}
