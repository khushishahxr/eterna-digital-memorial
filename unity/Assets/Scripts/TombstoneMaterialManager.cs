using UnityEngine;

public class TombstoneMaterialManager : MonoBehaviour
{
    public GameObject[] allTombstoneModels;
    public Material[] availableMaterials;  // 4 materials assigned in Inspector
    public Material currentMaterial;       // holds the selected one

    // Call this on button click, pass material index (0 to 3)
    public void SelectMaterial(int index)
    {
        if (index < 0 || index >= availableMaterials.Length)
        {
            Debug.LogWarning("Invalid material index");
            return;
        }

        currentMaterial = availableMaterials[index];

        // Apply to the active model
        foreach (GameObject model in allTombstoneModels)
        {
            if (model.activeInHierarchy)
            {
                Renderer[] renderers = model.GetComponentsInChildren<Renderer>();
                foreach (var rend in renderers)
                {
                    rend.material = currentMaterial;
                }
            }
        }

        Debug.Log("✅ Material selected: " + currentMaterial.name);
    }
}
