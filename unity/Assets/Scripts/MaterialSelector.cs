using UnityEngine;
using UnityEngine.UI;

public class MaterialSelector : MonoBehaviour
{
    [Header("Material Option")]
    public Material selectedMaterial;

    [Tooltip("Tag assigned to all tombstone models (e.g., 'Tombstone')")]
    public string modelTag = "Tombstone";

    [Header("Panel Progress")]
    public PanelController panelController;

    void Start()
    {
        Button btn = GetComponent<Button>();
        if (btn != null)
            btn.onClick.AddListener(OnClick);
    }

    void OnClick()
    {
        // Find all tombstone models with the given tag
        GameObject[] models = GameObject.FindGameObjectsWithTag(modelTag);
        foreach (GameObject model in models)
        {
            if (model.activeSelf)
            {
                Renderer[] renderers = model.GetComponentsInChildren<Renderer>();
                foreach (Renderer rend in renderers)
                {
                    rend.material = selectedMaterial;
                }

                Debug.Log("✅ Applied material to: " + model.name);
            }
        }

        if (panelController != null)
        {
            panelController.EnableNextButton();
        }
    }
}
