using UnityEngine;
using UnityEngine.UI;

public class TagBasedVisibility : MonoBehaviour
{
    [Header("Model Visibility Control")]
    public GameObject modelToShow;           // Drag your tombstone model here
    public string hideGroupTag = "Tombstone"; // All models with this tag will be hidden

    [Header("Panel Progress")]
    public PanelController panelController;  // Drag your PanelController object

    void Start()
    {
        Button btn = GetComponent<Button>();
        if (btn != null)
        {
            btn.onClick.AddListener(OnClick);
        }
    }

    void OnClick()
    {
        // Hide all other tombstone models
        GameObject[] allModels = GameObject.FindGameObjectsWithTag(hideGroupTag);
        foreach (GameObject obj in allModels)
        {
            obj.SetActive(false);
        }

        // Show selected one
        if (modelToShow != null)
        {
            modelToShow.SetActive(true);
            Debug.Log("✅ Activated model: " + modelToShow.name);

            // Tell the panel controller to enable "Next"
            if (panelController != null)
            {
                panelController.EnableNextButton();
            }
        }
        else
        {
            Debug.LogWarning("⚠️ modelToShow is not assigned.");
        }
    }
}
