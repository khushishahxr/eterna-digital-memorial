using UnityEngine;
using TMPro;
using System.IO;
using System.Text;

public class TombstoneFinalExporter : MonoBehaviour
{
    public GameObject[] allTombstoneModels;
    private TombstoneMaterialManager matManager;

    void Start()
    {
        // Find the material manager in the scene
        matManager = FindObjectOfType<TombstoneMaterialManager>();
    }

    [ContextMenu("Export Final Tombstone")]
    public void ExportFinalModel()
    {
        GameObject selectedModel = null;

        foreach (GameObject model in allTombstoneModels)
        {
            if (model.activeInHierarchy)
            {
                selectedModel = model;
                break;
            }
        }

        if (selectedModel == null)
        {
            Debug.LogError("❌ No active tombstone model found!");
            return;
        }

        GameObject combined = Instantiate(selectedModel);
        combined.name = "FinalTombstone";

        // 🧠 Convert all TMP texts into meshes before export
        TextMeshPro[] tmpComponents = combined.GetComponentsInChildren<TextMeshPro>();
        foreach (var tmp in tmpComponents)
        {
            tmp.ForceMeshUpdate(); // generate mesh
        }

        ExportAsOBJ(combined);
        Destroy(combined);
    }

    private void ExportAsOBJ(GameObject obj)
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

        string matName = matManager != null && matManager.currentMaterial != null
            ? matManager.currentMaterial.name
            : "NoMaterial";

        string folder = Path.Combine(Application.dataPath, "Exports");
        if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

        string filePath = Path.Combine(folder, obj.name + "_" + matName + ".obj");
        File.WriteAllText(filePath, sb.ToString());

        Debug.Log("✅ Exported to: " + filePath);
    }
}
