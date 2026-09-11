using UnityEngine;
using TMPro;
using System.Text;
using System.Runtime.InteropServices;

public class SimpleWebGLExporter : MonoBehaviour
{
    public GameObject[] allTombstoneModels;

#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void SaveFile(string filename, byte[] byteArray, int length);
#endif

    public void ExportForWebGL()
    {
        GameObject selected = null;

        foreach (GameObject model in allTombstoneModels)
        {
            if (model.activeInHierarchy)
            {
                selected = model;
                break;
            }
        }

        if (selected == null)
        {
            Debug.LogError("❌ No active model found!");
            return;
        }

        GameObject exportObj = Instantiate(selected);
        exportObj.name = "FinalTombstone";

        TextMeshPro[] tmps = exportObj.GetComponentsInChildren<TextMeshPro>();
        string nameVal = "Name", dateVal = "Date", quoteVal = "Quote";

        foreach (TextMeshPro tmp in tmps)
        {
            tmp.ForceMeshUpdate();
            string text = tmp.text;

            if (text.Contains("/")) text = text.Replace("/", "-");

            if (tmp.name.ToLower().Contains("name")) nameVal = text;
            if (tmp.name.ToLower().Contains("date")) dateVal = text;
            if (tmp.name.ToLower().Contains("quote")) quoteVal = text;
        }

        Renderer rend = exportObj.GetComponentInChildren<Renderer>();
        string matName = rend != null && rend.sharedMaterial != null ? rend.sharedMaterial.name : "Material";

        string fileName = $"Tomb_{nameVal}_{dateVal}_{quoteVal}_{matName}.obj";
        string objData = BuildOBJ(exportObj);

        Destroy(exportObj);

#if UNITY_WEBGL && !UNITY_EDITOR
        byte[] data = Encoding.UTF8.GetBytes(objData);
        SaveFile(fileName, data, data.Length);
#else
        Debug.Log("✅ WebGL export only works in browser build. Generated OBJ:\n" + objData);
#endif
    }

    private string BuildOBJ(GameObject obj)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("o " + obj.name + "\n");

        MeshFilter[] meshFilters = obj.GetComponentsInChildren<MeshFilter>();
        int vertexOffset = 0;

        foreach (MeshFilter mf in meshFilters)
        {
            Mesh mesh = mf.sharedMesh;
            if (mesh == null) continue;

            foreach (Vector3 v in mesh.vertices)
                sb.Append($"v {v.x} {v.y} {v.z}\n");

            foreach (Vector3 vn in mesh.normals)
                sb.Append($"vn {vn.x} {vn.y} {vn.z}\n");

            foreach (Vector2 vt in mesh.uv)
                sb.Append($"vt {vt.x} {vt.y}\n");

            for (int i = 0; i < mesh.triangles.Length; i += 3)
            {
                int a = mesh.triangles[i] + 1 + vertexOffset;
                int b = mesh.triangles[i + 1] + 1 + vertexOffset;
                int c = mesh.triangles[i + 2] + 1 + vertexOffset;
                sb.Append($"f {a}/{a}/{a} {b}/{b}/{b} {c}/{c}/{c}\n");
            }

            vertexOffset += mesh.vertexCount;
        }

        return sb.ToString();
    }
}
