import { IUserPermissions } from "../interfaces/user_permissions.interface";

export class UserRoles {
    public static user_permission_string: string = 'user';
    public static admin_permission_string: string = 'admin';
    public static admin_super_permission_string: string = 'super_admin';
    public static admin_sport_icon_permission_string: string = 'sport_icon';
    public static admin_country_icon_permission_string: string = 'country_icon';
    public static admin_league_icon_permission_string: string = 'league_icon';
    public static admin_category_view_permission_string: string = 'category_view';
    public static admin_category_add_permission_string: string = 'category_add';
    public static admin_category_delete_permission_string: string = 'category_delete';
    public static admin_category_edit_permission_string: string = 'category_edit';
    public static admin_category_hide_permission_string: string = 'category_hide';
    public static admin_category_mapping_permission_string: string = 'category_mapping';
    public static admin_category_active_only_permission_string: string = 'category_active_only';
    public static admin_participant_view_permission_string: string = 'participant_view';
    public static admin_market_view_permission_string: string = 'market_view';
    public static admin_market_add_permission_string: string = 'market_add';
    public static admin_market_edit_permission_string: string = 'market_edit';
    public static admin_market_delete_permission_string: string = 'market_delete';
    public static admin_market_mapping_permission_string: string = 'market_mapping';
    public static admin_market_hide_permission_string: string = 'market_hide';
    public static admin_market_active_only_permission_string: string = 'market_active_only';
    public static admin_market_show_all_permission_string: string = 'market_show_all';
    public static admin_event_view_permission_string: string = 'event_view';
    public static admin_result_view_permission_string: string = 'result_view';
    public static admin_users_view_permission_string: string = 'user_view';
    public static admin_admins_view_permission_string: string = 'admins_view';
    public static admin_admins_add_permission_string: string = 'admins_add';
    public static admin_providers_view_permission_string: string = 'providers_view';
    public static admin_providers_interval_permission_string: string = 'providers_interval';
    public static admin_providers_stop_start_permission_string: string = 'providers_stop_start';
    public static admin_mapping_view_permission_string: string = 'mapping_view';
    public static admin_mapping_league_view_permission_string: string = 'mapping_league_view';
    public static admin_mapping_hide_permission_string: string = 'mapping_hide';
    public static admin_mapping_league_active_only_permission_string: string = 'mapping_active_only';
    public static admin_mapping_league_show_all_permission_string: string = 'mapping_show_all';
    public static admin_mapping_participant_view_permission_string: string = 'mapping_participant_view';
    public static admin_mapping_warnings_view_permission_string: string = 'mapping_warnings_view';
    public static admin_settings_view_permission_string: string = 'settings_view';
    public static admin_settings_scopes_view_permission_string: string = 'settings_scopes_view';
    public static admin_settings_statistic_types_view_permission_string: string = 'settings_statistic_types_view';
    public static guest_permission_string: string = 'guest';
    public static service_provider_permission_string: string = 'service';
    public static admin_edit_user_permission_permission_string: string = "edit_user_permission"
    public static admin_block_permission_string = "block_user";
    public static admin_edit_user_permission_string = "edit_user";

    /**
     * Sync Getter Returns an array of Service related permissions
     * @static
     */
    public static get GetServiceProviderPermissions(): IUserPermissions {
        return [UserRoles.service_provider_permission_string]
    }
    /**
     * Sync Getter Returns an array of Guest related permissions
     * @static
     */
    public static get GetGuestPermissions(): IUserPermissions {
        return [UserRoles.guest_permission_string]
    }
    /**
     * Sync Check if the provided permissions array holds Admin permissions
     * @static
     * @param permissions 
     */
    public static IncludesGuestPermission(permissions: string[]): boolean {
        return permissions.includes(UserRoles.guest_permission_string)
    }
    /**
     * Sync Getter Returns an array of Admin related and User related permissions
     * @static
     */
    public static get GetAdminPermissions(): IUserPermissions {
        return [UserRoles.user_permission_string, UserRoles.admin_permission_string]
    }

    public static get GetSuperAdminPermissions(): IUserPermissions {
        return [UserRoles.user_permission_string, UserRoles.admin_permission_string, UserRoles.admin_super_permission_string];
    }
    /**
     * Sync Getter Returns an array of User related permissions
     * @static
     */
    public static get GetUserPermissions(): IUserPermissions {
        return [UserRoles.user_permission_string]
    }
    /**
     * Sync Returns an Array of User releated and Specified Extra permissions
     * @static
     * @param args 
     */
    public static GetExtraPermissions(...args: string[]): IUserPermissions {
        return [UserRoles.user_permission_string, ...args]
    }
    /**
     * Sync Checks if the provided array of permissions inlcudes Admin perrmissions
     * @param permissions 
     * @static
     */
    public static includesAdminPermission(permissions: IUserPermissions): boolean {
        return permissions.includes(UserRoles.admin_permission_string)
    }
    /**
     * Sync Checks if the provided array of permissions includes Extra permissions provided as the second argument
     * @param permissions 
     * @param extra_permissions 
     * @static
     */
    public static IncludesExtraPermissions(permissions: string[], extra_permissions: string[]): boolean {
        const includes = extra_permissions.map((el: string) => permissions.includes(el))
        return includes.reduce((prev: boolean, cur: boolean) => prev && cur, includes.length ? true : false)
    }

    public static GetPermissions(): IUserPermissions {
        return [
            UserRoles.user_permission_string,
            UserRoles.guest_permission_string,
            UserRoles.admin_permission_string,
            UserRoles.admin_super_permission_string,
            UserRoles.admin_sport_icon_permission_string,
            UserRoles.admin_country_icon_permission_string,
            UserRoles.admin_league_icon_permission_string,
            UserRoles.admin_edit_user_permission_permission_string,
            UserRoles.admin_edit_user_permission_string,
            UserRoles.admin_block_permission_string,
            UserRoles.admin_category_view_permission_string,
            UserRoles.admin_category_add_permission_string,
            UserRoles.admin_category_delete_permission_string,
            UserRoles.admin_category_edit_permission_string,
            UserRoles.admin_category_hide_permission_string,
            UserRoles.admin_category_active_only_permission_string,
            UserRoles.admin_category_mapping_permission_string,
            UserRoles.admin_participant_view_permission_string,
            UserRoles.admin_market_view_permission_string,
            UserRoles.admin_market_add_permission_string,
            UserRoles.admin_market_edit_permission_string,
            UserRoles.admin_market_delete_permission_string,
            UserRoles.admin_market_hide_permission_string,
            UserRoles.admin_market_active_only_permission_string,
            UserRoles.admin_market_show_all_permission_string,
            UserRoles.admin_market_mapping_permission_string,
            UserRoles.admin_event_view_permission_string,
            UserRoles.admin_result_view_permission_string,
            UserRoles.admin_users_view_permission_string,
            UserRoles.admin_admins_view_permission_string,
            UserRoles.admin_admins_add_permission_string,
            UserRoles.admin_providers_view_permission_string,
            UserRoles.admin_providers_interval_permission_string,
            UserRoles.admin_providers_stop_start_permission_string,
            UserRoles.admin_mapping_view_permission_string,
            UserRoles.admin_mapping_hide_permission_string,
            UserRoles.admin_mapping_league_view_permission_string,
            UserRoles.admin_mapping_league_show_all_permission_string,
            UserRoles.admin_mapping_league_active_only_permission_string,
            UserRoles.admin_mapping_participant_view_permission_string,
            UserRoles.admin_mapping_warnings_view_permission_string,
            UserRoles.admin_settings_view_permission_string,
            UserRoles.admin_settings_scopes_view_permission_string,
            UserRoles.admin_settings_statistic_types_view_permission_string
        ]
    }
}